import { v } from 'convex/values';
import { action } from './_generated/server';
import { api } from './_generated/api';

export const processChatMessage = action({
  args: {
    message: v.string(),
    sessionId: v.id('chatSessions'),
    timeZone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.current);
    if (!user) throw new Error('Unauthorized');
    const userId = user._id;

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) throw new Error('BACKEND_URL is not set');

    const secret = process.env.CONVEX_BACKEND_SECRET;
    if (!secret) throw new Error('CONVEX_BACKEND_SECRET is not set');

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-convex-backend-secret': secret,
        },
        body: JSON.stringify({
          message: args.message,
          sessionId: args.sessionId,
          timeZone: args.timeZone,
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error(
          `Failed to process message (Backend: ${response.status})`,
        );
      }

      const data = await response.json();
      return {
        reply: data.reply,
      };
    } catch (error: any) {
      console.error('AI Processing Error:', error);
      throw new Error(error.message || 'Failed to communicate with AI service');
    }
  },
});
