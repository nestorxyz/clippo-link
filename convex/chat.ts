import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserId } from './users';

// Backend usage: Add message without checking auth (trusting backend to pass correct sessionId)
export const saveMessage = mutation({
  args: {
    sessionId: v.id('chatSessions'),
    role: v.string(),
    parts: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('chatMessages', {
      sessionId: args.sessionId,
      role: args.role,
      parts: args.parts,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getOrCreateSession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const existing = await ctx.db
      .query('chatSessions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .order('desc')
      .first();

    if (existing) return existing;

    const id = await ctx.db.insert('chatSessions', {
      userId,
      createdAt: new Date().toISOString(),
    });

    return await ctx.db.get(id);
  },
});

export const getMessages = query({
  args: { sessionId: v.id('chatSessions') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    // Verify session belongs to user
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId)
      throw new Error('Unauthorized or invalid session');

    const messages = await ctx.db
      .query('chatMessages')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect();

    // Sort logic if creationTime is used? Convex uses _creationTime sort by default in query order if no index specified?
    // Wait, withIndex uses index order. by_session index is on sessionId.
    // Default order is creation time.
    return messages;
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.id('chatSessions'),
    role: v.string(),
    parts: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) throw new Error('Unauthorized');

    await ctx.db.insert('chatMessages', {
      sessionId: args.sessionId,
      role: args.role,
      parts: args.parts,
      createdAt: new Date().toISOString(),
    });
  },
});

export const clearHistory = mutation({
  args: { sessionId: v.id('chatSessions') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) throw new Error('Unauthorized');

    const messages = await ctx.db
      .query('chatMessages')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect();

    await Promise.all(messages.map((msg) => ctx.db.delete(msg._id)));
  },
});
