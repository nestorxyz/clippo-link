import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getPublicUrl = query({
  args: {
    storageId: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid Secret');
    }
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const generateUploadUrlForBackend = mutation({
  args: { secret: v.string() },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid Secret');
    }
    return await ctx.storage.generateUploadUrl();
  },
});
