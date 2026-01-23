import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { getUserId } from './users';

export const getByUser = query({
  args: {
    userId: v.id('users'),
    secret: v.string(), // Require secret
  },
  handler: async (ctx, args) => {
    // Security check: Verify backend secret
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid Secret');
    }

    // Backend usage: allow fetching by userId directly
    const categories = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
    return categories;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const categories = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const categoriesWithDetails = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await ctx.db
          .query('subCategories')
          .withIndex('by_category', (q) => q.eq('categoryId', category._id))
          .collect();

        const subCategoriesWithLinks = await Promise.all(
          subCategories.map(async (sub) => {
            const links = await ctx.db
              .query('links')
              .withIndex('by_subCategory', (q) =>
                q.eq('subCategoryId', sub._id),
              )
              .collect();

            const linksWithTags = await Promise.all(
              links.map(async (link) => {
                const linkTags = await ctx.db
                  .query('linkTags')
                  .withIndex('by_link', (q) => q.eq('linkId', link._id))
                  .collect();

                const tags = await Promise.all(
                  linkTags.map(async (lt) => {
                    const tag = await ctx.db.get(lt.tagId);
                    return tag ? { ...tag, id: tag._id } : null;
                  }),
                );

                return {
                  ...link,
                  id: link._id,
                  tags: tags.filter((t) => t !== null),
                };
              }),
            );

            return {
              ...sub,
              id: sub._id,
              links: linksWithTags,
            };
          }),
        );

        return {
          ...category,
          id: category._id,
          subCategories: subCategoriesWithLinks,
        };
      }),
    );

    return categoriesWithDetails;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const categoryId = await ctx.db.insert('categories', {
      name: args.name,
      description: args.description,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return categoryId;
  },
});

export const update = mutation({
  args: {
    id: v.id('categories'),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId)
      throw new Error('Unauthorized');

    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const category = await ctx.db.get(args.id);
    if (!category || category.userId !== userId)
      throw new Error('Unauthorized');

    const subCategories = await ctx.db
      .query('subCategories')
      .withIndex('by_category', (q) => q.eq('categoryId', args.id))
      .collect();

    for (const sub of subCategories) {
      // Cascade delete links and subcategories
      const links = await ctx.db
        .query('links')
        .withIndex('by_subCategory', (q) => q.eq('subCategoryId', sub._id))
        .collect();

      for (const link of links) {
        const linkTags = await ctx.db
          .query('linkTags')
          .withIndex('by_link', (q) => q.eq('linkId', link._id))
          .collect();
        await Promise.all(linkTags.map((lt) => ctx.db.delete(lt._id)));
        await ctx.db.delete(link._id);
      }
      await ctx.db.delete(sub._id);
    }

    await ctx.db.delete(args.id);
  },
});
