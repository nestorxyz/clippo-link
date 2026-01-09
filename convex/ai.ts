import { v } from 'convex/values';
import { action } from './_generated/server';
import { api } from './_generated/api';
import { getAuthUserId } from '@convex-dev/auth/server';
import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const modelName = 'gemini-2.5-flash';

export const processChatMessage = action({
  args: {
    message: v.string(),
    sessionId: v.id('chatSessions'),
    timeZone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

    // 1. Get User Context (Categories, etc.)
    const categories = await ctx.runQuery(api.categories.get, {});
    const tags = await ctx.runQuery(api.tags.get, {});

    // We don't have a direct query for all subcategories, but categories has nested.
    // We can extract them.
    const categoryNames =
      categories?.map((c) => c.name).join('\n- ') || 'personal';
    const subCategoriesList: string[] = [];
    categories?.forEach((c) =>
      c.subCategories.forEach((s) => subCategoriesList.push(s.name))
    );
    const subCategoryNames = subCategoriesList.join('\n- ') || 'general';
    const tagNames = tags?.map((t) => t.name).join('\n- ') || '';

    // 2. Prepare System Prompt
    const SYSTEM_PROMPT = `
      You are Clippo, a personal AI assistant for organizing links.
      Current Date: ${new Date().toISOString()}
      
      User's Categories:
      - ${categoryNames}
      
      User's Subcategories:
      - ${subCategoryNames}
      
      User's Tags:
      - ${tagNames}
      
      Your goal is to help the user save links and organize them.
      When a user provides a URL, you SHOULD:
      1. Analyze the URL using 'get_url_info' (if needed to get title/description).
      2. Register the link using 'register_link'.
      3. Reply to the user confirming the link was saved.
      
      If the user asks a general question, just answer it.
    `;

    // 3. Save User Message
    await ctx.runMutation(api.chat.addMessage, {
      sessionId: args.sessionId,
      role: 'user',
      parts: [{ text: args.message }],
    });

    // 4. Get History
    const history = await ctx.runQuery(api.chat.getMessages, {
      sessionId: args.sessionId,
    });

    // Convert to Vercel AI SDK Core Message format
    // We need to filter out 'function' roles or map them correctly if we want to support full history with tools.
    // For simplicity V1, we might just take the text parts for 'user' and 'model'.
    // Vercel AI SDK expects: { role: 'user' | 'assistant' | 'system' | 'tool', content: string | Array ... }

    // Simplification: use last few messages + current message
    // Note: 'parts' in our db is specific to Gemini SDK format probably, we need to adapt.
    // Our previous 'parts' were like [{ text: '...' }] or [{ functionCall: ... }]
    const messages = history
      .map((msg) => {
        let content = '';
        if (Array.isArray(msg.parts)) {
          content = msg.parts.map((p) => p.text).join('\n');
        }
        // Skip empty content or non-text messages for now to avoid errors, or handle tools properly.
        // If we want to support tool history, we need more complex mapping.
        // Let's stick to text history for context for now.
        return {
          role: msg.role === 'model' ? 'assistant' : 'user', // 'user' is 'user'
          content: content,
        };
      })
      .filter(
        (m) => m.content && (m.role === 'user' || m.role === 'assistant')
      );

    // 5. Generate Text with Tools
    const { text } = await generateText({
      model: google(modelName),
      system: SYSTEM_PROMPT,
      messages: [
        ...messages,
        { role: 'user', content: args.message }, // Ensure current message is included if not in history yet
      ],
      // @ts-expect-error maxSteps does exist in ai sdk core but type def might be lagging
      maxSteps: 5, // Allow multi-step execution
      tools: {
        get_url_info: tool({
          description: 'Analyzes a URL to extract title and description',
          inputSchema: z.object({
            url: z.string().describe('The URL to analyze'),
          }),
          execute: async ({ url }) => {
            try {
              const res = await fetch(url);
              const html = await res.text();
              const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
              const description =
                html.match(/<meta name="description" content="(.*?)"/)?.[1] ||
                '';
              return { title, description };
            } catch (e) {
              return { error: 'Failed to fetch URL' };
            }
          },
        }),
        register_link: tool({
          description: 'Saves a link to the database',
          inputSchema: z.object({
            url: z.string(),
            title: z.string(),
            description: z.string().optional(),
            category: z.string(),
            subcategory: z.string().optional(),
            tags: z.array(z.string()).optional(),
            imgPreview: z.string().optional(),
          }),
          execute: async (input) => {
            const res = await ctx.runMutation(api.links.register, {
              url: input.url,
              title: input.title,
              description: input.description,
              category: input.category,
              subcategory: input.subcategory,
              tags: input.tags,
              imgPreview: input.imgPreview,
            });
            return { success: res.success, linkId: res.linkId };
          },
        }),
      },
    });

    // 6. Save AI Response
    await ctx.runMutation(api.chat.addMessage, {
      sessionId: args.sessionId,
      role: 'model',
      parts: [{ text: text }],
    });

    // We can also check toolResults if we want to store them or do something.
    // toolResults contains the output of the tools.

    // 7. Return to client
    // Client Chat.tsx just needs the reply text.
    // functionCalls are handled server side now.
    return {
      reply: text,
      // functionCalls: [] // No longer needed for client execution
    };
  },
});
