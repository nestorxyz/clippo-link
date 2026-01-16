import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserId } from './users';

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    // Backend usage
    const subCategories = await ctx.db
      .query('subCategories')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return subCategories;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id('categories'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const subCategoryId = await ctx.db.insert('subCategories', {
      name: args.name,
      description: args.description,
      categoryId: args.categoryId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return subCategoryId;
  },
});

export const update = mutation({
  args: {
    id: v.id('subCategories'),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const subCategory = await ctx.db.get(args.id);
    if (!subCategory || subCategory.userId !== userId)
      throw new Error('Unauthorized');

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id('subCategories') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const subCategory = await ctx.db.get(args.id);
    if (!subCategory || subCategory.userId !== userId)
      throw new Error('Unauthorized');

    // Cascade delete links and linkTags
    const links = await ctx.db
      .query('links')
      .withIndex('by_subCategory', (q) => q.eq('subCategoryId', args.id))
      .collect();

    for (const link of links) {
      const linkTags = await ctx.db
        .query('linkTags')
        .withIndex('by_link', (q) => q.eq('linkId', link._id))
        .collect();
      await Promise.all(linkTags.map((lt) => ctx.db.delete(lt._id)));
      await ctx.db.delete(link._id);
    }

    await ctx.db.delete(args.id);
  },
});
