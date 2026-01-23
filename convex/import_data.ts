import { mutation } from './_generated/server';
import { v } from 'convex/values';

// Import Categories
export const importCategory = mutation({
  args: {
    originalId: v.string(), // retired-provider ID, useful for mapping if needed, or we just map outside
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // We can insert and potentially store the original ID in a separate mapping table if we wanted to be super robust,
    // but for now, we'll just insert and return the new ID.
    // The script will maintain the map of Old ID -> New ID.
    const ts = args.createdAt ? Date.parse(args.createdAt) : Date.now();
    const newId = await ctx.db.insert('categories', {
      name: args.name,
      description: args.description,
      userId: args.userId,
      createdAt: ts,
      updatedAt: ts,
    });
    return newId;
  },
});

export const importSubCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id('categories'),
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ts = args.createdAt ? Date.parse(args.createdAt) : Date.now();
    return await ctx.db.insert('subCategories', {
      name: args.name,
      description: args.description,
      categoryId: args.categoryId,
      userId: args.userId,
      createdAt: ts,
      updatedAt: ts,
    });
  },
});

export const importTag = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ts = args.createdAt ? Date.parse(args.createdAt) : Date.now();
    return await ctx.db.insert('tags', {
      name: args.name,
      color: args.color,
      userId: args.userId,
      createdAt: ts,
      updatedAt: ts,
    });
  },
});

export const importLink = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    imgPreview: v.optional(v.string()),
    subCategoryId: v.optional(v.id('subCategories')),
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
    tagIds: v.optional(v.array(v.id('tags'))), // Pass resolved Tag IDs
  },
  handler: async (ctx, args) => {
    const ts = args.createdAt ? Date.parse(args.createdAt) : Date.now();
    const linkId = await ctx.db.insert('links', {
      url: args.url,
      title: args.title,
      description: args.description,
      imgPreview: args.imgPreview,
      subCategoryId: args.subCategoryId,
      userId: args.userId,
      createdAt: ts,
      updatedAt: ts,
      isFavorite: false,
      isReadLater: false,
    });

    if (args.tagIds) {
      for (const tagId of args.tagIds) {
        await ctx.db.insert('linkTags', {
          linkId,
          tagId,
          createdAt: ts,
        });
      }
    }
    return linkId;
  },
});

export const importChatMessage = mutation({
  args: {
    sessionId: v.id('chatSessions'),
    role: v.string(),
    parts: v.any(),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ts = args.createdAt ? Date.parse(args.createdAt) : Date.now();
    return await ctx.db.insert('chatMessages', {
      sessionId: args.sessionId,
      role: args.role,
      parts: args.parts,
      createdAt: ts,
    });
  },
});

export const importChatSession = mutation({
  args: {
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ts = args.createdAt ? Date.parse(args.createdAt) : Date.now();
    return await ctx.db.insert('chatSessions', {
      userId: args.userId,
      createdAt: ts,
      updatedAt: ts,
    });
  },
});

// Helper query to find user by email for mapping
export const getUserByEmail = mutation({
  args: { email: v.string() }, // Mutation to avoid index creation overhead? No, user lookup should be query usually but internal is fine.
  handler: async (ctx, args) => {
    // Note: convex-auth 'users' table usually has 'email' field.
    // We need to check schema.ts or auth config.
    // Assuming 'email' exists on 'users'.
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();
    return user?._id;
  },
});

export const importUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Double check existence to avoid duplicates race
    const existing = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert('users', {
      email: args.email,
      name: args.name,
      image: args.image,
      // Convex Auth might expect other fields but these are standard
    });
  },
});

export const importProfile = mutation({
  args: {
    userId: v.id('users'),
    phoneNumber: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    phoneVerifiedAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if profile exists for user
    const existing = await ctx.db
      .query('profiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    const verifiedAt = args.phoneVerifiedAt
      ? Date.parse(args.phoneVerifiedAt)
      : undefined;
    const updatedAt = args.updatedAt ? Date.parse(args.updatedAt) : Date.now();

    if (existing) {
      // Update existing profile
      return await ctx.db.patch(existing._id, {
        phoneNumber: args.phoneNumber,
        phoneVerified: args.phoneVerified,
        phoneVerifiedAt: verifiedAt,
        updatedAt: updatedAt,
      });
    }

    return await ctx.db.insert('profiles', {
      userId: args.userId,
      phoneNumber: args.phoneNumber,
      phoneVerified: args.phoneVerified,
      phoneVerifiedAt: verifiedAt,
      updatedAt: updatedAt,
    });
  },
});
