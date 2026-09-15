import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserId } from './users';

export const getOrCreateSession = mutation({
  args: {
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const source = args.source ?? 'web';

    const existing = await ctx.db
      .query('chatSessions')
      .withIndex('by_user_source', (q) =>
        q.eq('userId', userId).eq('source', source),
      )
      .order('desc')
      .first();

    if (existing) return existing;

    const id = await ctx.db.insert('chatSessions', {
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source,
    });

    return await ctx.db.get(id);
  },
});

export const getOrCreateSessionForBackend = mutation({
  args: {
    userId: v.id('users'),
    source: v.optional(v.string()),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid secret');
    }

    const source = args.source ?? 'web';
    const existing = await ctx.db
      .query('chatSessions')
      .withIndex('by_user_source', (q) =>
        q.eq('userId', args.userId).eq('source', source),
      )
      .order('desc')
      .first();
    if (existing) return existing;

    const id = await ctx.db.insert('chatSessions', {
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source,
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
      createdAt: Date.now(),
    });
  },
});

export const saveMessage = mutation({
  args: {
    sessionId: v.id('chatSessions'),
    role: v.string(),
    parts: v.any(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    // Authenticate via secret since this is called by the external backend
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid secret');
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error('Session not found');

    await ctx.db.insert('chatMessages', {
      sessionId: args.sessionId,
      role: args.role,
      parts: args.parts,
      createdAt: Date.now(),
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

export const getMessagesForBackend = query({
  args: {
    sessionId: v.id('chatSessions'),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid secret');
    }

    const messages = await ctx.db
      .query('chatMessages')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect();

    return messages;
  },
});

