
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenAI, FunctionDeclarationSchemaType as Type, Content } from 'npm:@google/genai@latest';
import { Database } from '../_shared/database.types.ts';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const modelName = "gemini-2.5-flash-preview-05-20";

const tools = {
  functionDeclarations: [
    {
      name: "register_link",
      description: "Registers a new link in the user's collection.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING, description: "The URL of the link." },
          description: { type: Type.STRING, description: "A brief description of the link." },
          category_name: { type: Type.STRING, description: "The category to place the link under. Should be a single word or short phrase." },
          sub_category_name: { type: Type.STRING, description: "The sub-category within the main category. Should be a single word or short phrase." },
        },
        required: ["url", "category_name", "sub_category_name"],
      },
    },
    {
      name: "get_links",
      description: "Retrieves links from the user's collection based on filters.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          category_name: { type: Type.STRING, description: "The category to filter by." },
          sub_category_name: { type: Type.STRING, description: "The sub-category to filter by." },
          keywords: { type: Type.STRING, description: "Keywords to search for in link URLs or descriptions." },
        },
      },
    },
  ],
};

async function registerLink(supabase: SupabaseClient<Database>, user_id: string, args: any) {
  const { url, description, category_name, sub_category_name } = args;

  let { data: category } = await supabase.from('categories').select('id').eq('name', category_name).eq('user_id', user_id).maybeSingle();

  if (!category) {
    const { data: newCategory, error: newCatError } = await supabase.from('categories').insert({ name: category_name, user_id: user_id }).select('id').single();
    if (newCatError) throw newCatError;
    category = newCategory;
  }

  let { data: subCategory } = await supabase.from('sub_categories').select('id').eq('name', sub_category_name).eq('category_id', category.id).eq('user_id', user_id).maybeSingle();

  if (!subCategory) {
    const { data: newSubCategory, error: newSubCatError } = await supabase.from('sub_categories').insert({ name: sub_category_name, category_id: category.id, user_id: user_id }).select('id').single();
    if (newSubCatError) throw newSubCatError;
    subCategory = newSubCategory;
  }

  const { error: linkError } = await supabase.from('links').insert({ url, description, sub_category_id: subCategory.id, user_id: user_id });

  if (linkError) return { success: false, error: linkError.message };
  return { success: true };
}

async function getLinks(supabase: SupabaseClient<Database>, user_id: string, args: any) {
  const { category_name, sub_category_name, keywords } = args;
  
  let query = supabase.from('links').select(`
    url,
    description,
    sub_categories!inner(
      name,
      categories!inner(name)
    )
  `).eq('user_id', user_id);

  if (category_name) query = query.eq('sub_categories.categories.name', category_name);
  if (sub_category_name) query = query.eq('sub_categories.name', sub_category_name);
  if (keywords) query = query.or(`description.ilike.%${keywords}%,url.ilike.%${keywords}%`);

  const { data: links, error: linksError } = await query;

  if (linksError) return { result: `Error fetching links: ${linksError.message}` };
  if (!links || links.length === 0) return { result: "I couldn't find any links matching your criteria." };
  
  return { links };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId, message } = await req.json();
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', parts: [{ text: message }] });

    const { data: historyData, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, parts')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (historyError) throw historyError;
    
    const contents: Content[] = historyData.map(h => ({ role: h.role as 'user' | 'model' | 'function', parts: h.parts as any[] }));

    let result = await genAI.models.generateContent({
      model: modelName,
      contents,
      tools: [{ functionDeclarations: tools.functionDeclarations }]
    });

    let botReply = "";
    const functionCallsForClient = [];

    if (result.functionCalls && result.functionCalls.length > 0) {
      const functionCallParts = result.functionCalls.map(fc => ({ functionCall: fc }));
      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'model', parts: functionCallParts });
      contents.push({ role: 'model', parts: functionCallParts });

      const functionResponseParts = [];
      for (const fc of result.functionCalls) {
        let functionResponse;
        if (fc.name === 'register_link') {
            functionResponse = await registerLink(supabase, user.id, fc.args);
        } else if (fc.name === 'get_links') {
            functionResponse = await getLinks(supabase, user.id, fc.args);
        }
        functionCallsForClient.push({ function: { name: fc.name, result: functionResponse } });
        functionResponseParts.push({ functionResponse: { name: fc.name, response: functionResponse } });
      }

      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'function', parts: functionResponseParts });
      contents.push({ role: 'function', parts: functionResponseParts });
      
      const secondResult = await genAI.models.generateContent({ model: modelName, contents });
      
      if (secondResult.text) {
        botReply = secondResult.text;
      }
    } else if (result.text) {
        botReply = result.text;
    }
    
    if (botReply) {
      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'model', parts: [{ text: botReply }] });
    }

    return new Response(JSON.stringify({ reply: botReply, functionCalls: functionCallsForClient }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
