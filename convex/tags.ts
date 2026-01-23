import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { getUserId } from './users';

export const getByUser = query({
  args: {
    userId: v.id('users'),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    // Security check
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid Secret');
    }

    // Backend usage
    const tags = await ctx.db
      .query('tags')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return tags.map((tag) => ({ ...tag, id: tag._id }));
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const tags = await ctx.db
      .query('tags')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    return tags.map((tag) => ({ ...tag, id: tag._id }));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const tagId = await ctx.db.insert('tags', {
      name: args.name,
      color: args.color,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return tagId;
  },
});

export const update = mutation({
  args: {
    id: v.id('tags'),
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const tag = await ctx.db.get(args.id);
    if (!tag || tag.userId !== userId) throw new Error('Unauthorized');

    await ctx.db.patch(args.id, {
      name: args.name,
      color: args.color,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id('tags') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const tag = await ctx.db.get(args.id);
    if (!tag || tag.userId !== userId) throw new Error('Unauthorized');

    // Remove from linkTags
    const linkTags = await ctx.db
      .query('linkTags')
      .withIndex('by_tag', (q) => q.eq('tagId', args.id))
      .collect();

    await Promise.all(linkTags.map((lt) => ctx.db.delete(lt._id)));

    await ctx.db.delete(args.id);
  },
});
