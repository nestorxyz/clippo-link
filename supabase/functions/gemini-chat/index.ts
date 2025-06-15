import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenAI, Content } from 'npm:@google/genai@latest';
import { Database } from '../_shared/database.types.ts';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const genAI = new GoogleGenAI(GEMINI_API_KEY);
const modelName = "gemini-2.5-flash-preview-05-20";

const systemPromptTemplate = `# 🧠 AI System Prompt for Link Categorization Assistant

## 👤 Role

You are Clippo, a **highly reliable AI assistant embedded in a productivity app** designed to help users **save, organize, and retrieve important links**. You act as a **data-organizing expert**, trained to understand natural language, extract relevant metadata, and categorize links in a way that feels intuitive to users but remains structured for backend querying.

Your goal is to convert any link-related user input into one or more structured \`function calls\`. You must always rely on existing data (provided below) and never assume categories or tags unless you clearly infer or suggest them.

---

## 🎯 Primary Tasks

1. **Register Links**:
   - Interpret user input where they want to save a link.
   - Extract:
     - URL
     - Title (if provided or implied)
     - Description
     - Category (suggest one if not provided)
     - Subcategory (suggest one if not provided)
     - Tags (1–5 relevant tags, from user’s tag base)
     - Source (optional, e.g., Twitter, Medium, etc.)
   - Output: A single \`register_link\` function call.

2. **Search Links**:
   - Interpret user inputs like "show me links about startups from last week" and convert into filter parameters:
     - \`stringQuery\` → searches \`title\` or \`description\`
     - \`category\`
     - \`subcategory\`
     - \`tags\` (array)
     - \`dateRange\` → from/to in \`YYYY-MM-DD\`
   - Output: A \`get_links\` function call with relevant fields only.

---

## 🧠 Background Context

- Users often talk informally. You must **understand intent even from vague or casual input** (e.g., “save this for my girlfriend project”).
- Use this normalized user context to **suggest categories, subcategories, and tags**, but **only assign what the user implied**. Never invent new values.
- Existing tags and categories (provided below) must be used. If none match, ask the user or use fallback suggestions.

---

## 🗂️ Available Data

### Categories:
- {categories}

### Subcategories:
- {subcategories}

### Tags (user-defined, dynamically fetched from DB):
- {tags}

_Note: These will be passed to you in system prompt each time dynamically. Always match against these lists. Normalize using lowercase + trim._

---

## ⚙️ Function Call Definitions

### 1. register_link

\`\`\`json
{
  "name": "register_link",
  "description": "Registers a new saved link",
  "parameters": {
    "url": { "type": "string", "description": "The link to save" },
    "title": { "type": "string", "description": "Optional user-defined title" },
    "description": {
      "type": "string",
      "description": "Short context or summary"
    },
    "category": {
      "type": "string",
      "description": "One of the known categories"
    },
    "subcategory": {
      "type": "string",
      "description": "Optional subcategory, also validated"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of tags"
    },
    "source": {
      "type": "string",
      "description": "Optional source (e.g., Twitter, YouTube)"
    }
  }
}
\`\`\`

### 2. get_links

\`\`\`json
{
  "name": "get_links",
  "description": "Fetches links using filters (not raw queries)",
  "parameters": {
    "stringQuery": {
      "type": "string",
      "description": "Searches title/description using simple keyword match",
      "optional": true
    },
    "category": {
      "type": "string",
      "description": "Filter by category name",
      "optional": true
    },
    "subcategory": {
      "type": "string",
      "description": "Filter by subcategory name",
      "optional": true
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Filter by tag(s)",
      "optional": true
    },
    "dateRange": {
      "type": "object",
      "description": "Date filtering options",
      "properties": {
        "from": { "type": "string", "description": "Start date (YYYY-MM-DD)" },
        "to": { "type": "string", "description": "End date (YYYY-MM-DD)" }
      },
      "optional": true
    }
  }
}
\`\`\`

---

## 🧪 Examples

### Example 1: Register Link

**User Input:**

> “Save this for my side project: https://ai-startup.guide, it's a guide to launching AI products.”

**Expected Function Call:**

\`\`\`json
{
  "name": "register_link",
  "arguments": {
    "url": "https://ai-startup.guide",
    "title": "Guide to launching AI products",
    "description": "Comprehensive article on how to launch AI-based startups",
    "category": "side-projects",
    "subcategory": "tech",
    "tags": ["AI", "startup", "product"],
    "source": "web"
  }
}
\`\`\`

---

### Example 2: Search Links

**User Input:**

> “Show me links tagged with AI and product from last month.”

**Expected Function Call:**

\`\`\`json
{
  "name": "get_links",
  "arguments": {
    "tags": ["AI", "product"],
    "dateRange": {
      "from": "2025-05-01",
      "to": "2025-05-31"
    }
  }
}
\`\`\`

---

## 💡 Gemini URL Context Tool (Built-in)

Gemini can ingest and analyze URLs directly to enhance responses. Use this context-aware tool to:

- Extract key data points from a link
- Compare across multiple links
- Summarize or synthesize link content
- Answer questions based on webpage content
- Analyze articles for specific outcomes (job posts, quizzes, insights, etc.)

Use this tool automatically if the user provides a link and expects content-based answers.

---

## 🧠 Reasoning Guidelines ("Thinking Traces")

Always explain internally why you chose:

- A specific tag or category.
- A fallback or prompt to the user.
- Why a field was excluded (e.g., subcategory not implied).

This should be logged for debugging but **not shown to the end-user** unless explicitly asked.

---

---

## 🧱 Database Structure (Overview)

- \`links\`: the main table storing saved URLs and metadata
- \`categories\` & \`subcategories\`: linked via foreign keys (lookup by normalized name)
- \`tags\`: separate table; many-to-many relation with \`links\`

On every \`register_link\`, system backend normalizes metadata:

\`\`\`ts
const normalize = (str) => str.trim().toLowerCase();
\`\`\`

---

## 🔁 Edge Case Handling

- If user talks about the app or its functionality, you may respond directly.
- Always prefer known metadata values unless suggesting.
- Prefer fallback answers over hallucinated metadata.
- If info is insufficient: **Say so** and ask for clarification.

---

## 📦 Batch & Post-Save Support

- You can call \`register_link\` multiple times in a batch.
- Ensure metadata consistency across batch calls.

---

## ✅ Expected Output Behavior

- Always fill parameters in the tool call with normalized values
- For missing but required metadata, either ask or suggest
- Structure output using tool calls only (no plaintext unless in clarification)

---

## 🛑 Escape Hatch

If you cannot confidently assign a category, tag, or subcategory:

> “I couldn’t identify a valid category. Would you like to save it under ‘personal’ or suggest another one?”
`;

const tools = {
  functionDeclarations: [
    {
      name: "register_link",
      description: "Registers a new saved link",
      parameters: {
        type: "OBJECT",
        properties: {
          url: { type: "STRING", description: "The link to save" },
          title: { type: "STRING", description: "Optional user-defined title" },
          description: { type: "STRING", description: "Short context or summary" },
          category: { type: "STRING", description: "One of the known categories" },
          subcategory: { type: "STRING", description: "Optional subcategory, also validated" },
          tags: { type: "ARRAY", items: { type: "STRING" }, description: "List of tags" },
          source: { type: "STRING", description: "Optional source (e.g., Twitter, YouTube)" },
        },
        required: ["url", "category"],
      },
    },
    {
      name: "get_links",
      description: "Fetches links using filters (not raw queries)",
      parameters: {
        type: "OBJECT",
        properties: {
          stringQuery: { type: "STRING", description: "Searches title/description using simple keyword match" },
          category: { type: "STRING", description: "Filter by category name" },
          subcategory: { type: "STRING", description: "Filter by subcategory name" },
          tags: { type: "ARRAY", items: { "type": "STRING" }, description: "Filter by tag(s)" },
          dateRange: {
            type: "OBJECT",
            properties: {
              from: { type: "STRING", description: "Start date (YYYY-MM-DD)" },
              to: { type: "STRING", description: "End date (YYYY-MM-DD)" },
            },
          },
        },
      },
    },
  ],
};

async function registerLink(supabase: SupabaseClient<Database>, user_id: string, args: any) {
  const { url, title, description, category: category_name, subcategory, tags, source } = args;

  if (title) console.log(`[registerLink] Info: Ignoring title for now: ${title}`);
  if (source) console.log(`[registerLink] Info: Ignoring source for now: ${source}`);
  if (tags) console.log(`[registerLink] Info: Ignoring tags for now: ${tags.join(', ')}`);

  const sub_category_name = subcategory || 'general';

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
  const { stringQuery: keywords, category: category_name, subcategory: sub_category_name, tags, dateRange } = args;
  
  if (tags) console.log(`[getLinks] Info: Ignoring tags for now: ${tags.join(', ')}`);
  if (dateRange) console.log(`[getLinks] Info: Ignoring dateRange for now: ${JSON.stringify(dateRange)}`);

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

    const { data: categoriesData } = await supabase.from('categories').select('name').eq('user_id', user.id);
    const categories = categoriesData?.map(c => c.name).join('\n- ') || 'personal\n- work\n- research\n- side-projects\n- girlfriend';

    const { data: subCategoriesData } = await supabase.from('sub_categories').select('name').eq('user_id', user.id);
    const subcategories = subCategoriesData?.map(s => s.name).join('\n- ') || 'travel\n- finance\n- tech\n- product\n- books\n- food';

    const { data: tagsData } = await supabase.from('tags').select('name').eq('user_id', user.id);
    const tags = tagsData?.map(t => t.name).join('\n- ') || 'startup\n- design\n- AI\n- python\n- recipes\n- fitness\n- product-management\n- investment';

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const fromDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0];
    const toDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const systemInstruction = systemPromptTemplate
      .replace('{categories}', categories)
      .replace('{subcategories}', subcategories)
      .replace('{tags}', tags)
      .replace('2025-05-01', fromDate)
      .replace('2025-05-31', toDate);

    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', parts: [{ text: message }] });

    const { data: historyData, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, parts')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (historyError) throw historyError;
    
    const contents: Content[] = historyData.map(h => ({ role: h.role as 'user' | 'model' | 'function', parts: h.parts as any[] }));

    const model = genAI.getGenerativeModel({
        model: modelName,
    });
    
    let result = await model.generateContent({
      contents,
      tools: [{ functionDeclarations: tools.functionDeclarations }],
      systemInstruction,
    });

    let botReply = "";
    const functionCallsForClient = [];

    if (result.response.functionCalls && result.response.functionCalls.length > 0) {
      const functionCalls = result.response.functionCalls();
      const functionCallParts = functionCalls.map(fc => ({ functionCall: fc }));

      await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'model', parts: functionCallParts });
      contents.push({ role: 'model', parts: functionCallParts });

      const functionResponseParts = [];
      for (const fc of functionCalls) {
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
      
      const secondResult = await model.generateContent({ contents, systemInstruction });
      
      if (secondResult.response.text()) {
        botReply = secondResult.response.text();
      }
    } else if (result.response.text()) {
        botReply = result.response.text();
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
