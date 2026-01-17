import { mutation } from './_generated/server';

export const backfillLinkFields = mutation({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db.query('links').collect();
    for (const link of links) {
      if (link.isFavorite === undefined || link.isReadLater === undefined) {
        await ctx.db.patch(link._id, {
          isFavorite: link.isFavorite ?? false,
          isReadLater: link.isReadLater ?? false,
        });
      }
    }
  },
});
