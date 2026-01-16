import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const create = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    imgPreview: v.optional(v.string()),
    subCategoryId: v.optional(v.id('subCategories')),
    tagIds: v.optional(v.array(v.id('tags'))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const linkId = await ctx.db.insert('links', {
      url: args.url,
      title: args.title,
      description: args.description,
      imgPreview: args.imgPreview,
      subCategoryId: args.subCategoryId,
      userId,
      createdAt: new Date().toISOString(),
    });

    if (args.tagIds?.length) {
      await Promise.all(
        args.tagIds.map((tagId) =>
          ctx.db.insert('linkTags', {
            linkId,
            tagId,
          })
        )
      );
    }

    return linkId;
  },
});

export const update = mutation({
  args: {
    id: v.id('links'),
    url: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    imgPreview: v.optional(v.string()),
    subCategoryId: v.optional(v.id('subCategories')),
    tagIds: v.optional(v.array(v.id('tags'))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const link = await ctx.db.get(args.id);
    if (!link || link.userId !== userId)
      throw new Error('Link not found or unauthorized');

    await ctx.db.patch(args.id, {
      ...(args.url && { url: args.url }),
      ...(args.title && { title: args.title }),
      ...(args.description && { description: args.description }),
      ...(args.imgPreview && { imgPreview: args.imgPreview }),
      ...(args.subCategoryId && { subCategoryId: args.subCategoryId }),
    });

    if (args.tagIds !== undefined) {
      const existingLinkTags = await ctx.db
        .query('linkTags')
        .withIndex('by_link', (q) => q.eq('linkId', args.id))
        .collect();

      await Promise.all(existingLinkTags.map((lt) => ctx.db.delete(lt._id)));

      await Promise.all(
        args.tagIds.map((tagId) =>
          ctx.db.insert('linkTags', {
            linkId: args.id,
            tagId,
          })
        )
      );
    }

    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id('links') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    const link = await ctx.db.get(args.id);
    if (!link || link.userId !== userId)
      throw new Error('Link not found or unauthorized');

    // Delete associated linkTags
    const linkTags = await ctx.db
      .query('linkTags')
      .withIndex('by_link', (q) => q.eq('linkId', args.id))
      .collect();

    await Promise.all(linkTags.map((lt) => ctx.db.delete(lt._id)));

    await ctx.db.delete(args.id);
  },
});

export const registerLinkForBackend = mutation({
  args: {
    userId: v.id('users'),
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(), // Name
    subcategory: v.optional(v.string()), // Name
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    imgPreview: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId; // Trust the backend

    // 1. Get or create category
    let category = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('name'), args.category))
      .first();

    if (!category) {
      const catId = await ctx.db.insert('categories', {
        name: args.category,
        userId,
        createdAt: new Date().toISOString(),
      });
      category = (await ctx.db.get(catId))!;
    }

    // 2. Get or create subcategory
    const subCategoryName = args.subcategory || 'general';
    let subCategory = await ctx.db
      .query('subCategories')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) =>
        q.and(
          q.eq(q.field('name'), subCategoryName),
          q.eq(q.field('categoryId'), category!._id)
        )
      )
      .first();

    if (!subCategory) {
      const subId = await ctx.db.insert('subCategories', {
        name: subCategoryName,
        categoryId: category!._id,
        userId,
        createdAt: new Date().toISOString(),
      });
      subCategory = (await ctx.db.get(subId))!;
    }

    // 3. Create Link
    const linkId = await ctx.db.insert('links', {
      url: args.url,
      title: args.title,
      description: args.description,
      subCategoryId: subCategory._id,
      userId,
      imgPreview: args.imgPreview,
      createdAt: new Date().toISOString(),
    });

    // 4. Handle Tags
    if (args.tags && args.tags.length > 0) {
      for (const tagName of args.tags) {
        const normalized = tagName.trim().toLowerCase();
        if (!normalized) continue;

        let tag = await ctx.db
          .query('tags')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .filter((q) => q.eq(q.field('name'), normalized))
          .first();

        if (!tag) {
          // Need color generator. Just use random for now.
          const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          const tagId = await ctx.db.insert('tags', {
            name: normalized,
            userId,
            color,
          });
          tag = (await ctx.db.get(tagId))!;
        }

        await ctx.db.insert('linkTags', {
          linkId,
          tagId: tag._id,
        });
      }
    }

    return { success: true, linkId };
  },
});

export const register = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(), // Name
    subcategory: v.optional(v.string()), // Name
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    imgPreview: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Unauthorized');

    // 1. Get or create category
    let category = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('name'), args.category))
      .first();

    if (!category) {
      const catId = await ctx.db.insert('categories', {
        name: args.category,
        userId,
        createdAt: new Date().toISOString(),
      });
      category = (await ctx.db.get(catId))!;
    }

    // 2. Get or create subcategory
    const subCategoryName = args.subcategory || 'general';
    let subCategory = await ctx.db
      .query('subCategories')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) =>
        q.and(
          q.eq(q.field('name'), subCategoryName),
          q.eq(q.field('categoryId'), category!._id)
        )
      )
      .first();

    if (!subCategory) {
      const subId = await ctx.db.insert('subCategories', {
        name: subCategoryName,
        categoryId: category!._id,
        userId,
        createdAt: new Date().toISOString(),
      });
      subCategory = (await ctx.db.get(subId))!;
    }

    // 3. Create Link
    const linkId = await ctx.db.insert('links', {
      url: args.url,
      title: args.title,
      description: args.description,
      subCategoryId: subCategory._id,
      userId,
      imgPreview: args.imgPreview,
      createdAt: new Date().toISOString(),
    });

    // 4. Handle Tags
    if (args.tags && args.tags.length > 0) {
      for (const tagName of args.tags) {
        const normalized = tagName.trim().toLowerCase();
        if (!normalized) continue;

        let tag = await ctx.db
          .query('tags')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .filter((q) => q.eq(q.field('name'), normalized))
          .first();

        if (!tag) {
          // Need color generator. Just use random for now.
          const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          const tagId = await ctx.db.insert('tags', {
            name: normalized,
            userId,
            color,
          });
          tag = (await ctx.db.get(tagId))!;
        }

        await ctx.db.insert('linkTags', {
          linkId,
          tagId: tag._id,
        });
      }
    }

    return { success: true, linkId };
  },
});

export const getRecentLinksForUser = query({
  args: {
    userId: v.id('users'),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query('links')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(args.limit);

    const enrichedLinks = await Promise.all(
      links.map(async (link) => {
        let subCategory = null;
        let category = null;

        if (link.subCategoryId) {
          subCategory = await ctx.db.get(link.subCategoryId);
          if (subCategory && subCategory.categoryId) {
            category = await ctx.db.get(subCategory.categoryId);
          }
        }

        return {
          ...link,
          subCategory,
          category,
        };
      })
    );

    return enrichedLinks;
  },
});
