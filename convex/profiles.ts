import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getByPhoneNumber = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('profiles')
      .withIndex('by_phone', (q) => q.eq('phoneNumber', args.phoneNumber))
      .first();
  },
});

export const getOrCreateByPhone = mutation({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    const formattedPhone = args.phoneNumber;

    // 1. Check if profile exists
    let profile = await ctx.db
      .query('profiles')
      .withIndex('by_phone', (q) => q.eq('phoneNumber', formattedPhone))
      .first();

    if (profile) {
      // Update verification if needed
      if (!profile.phoneVerified) {
        await ctx.db.patch(profile._id, {
          phoneVerified: true,
          phoneVerifiedAt: Date.now(),
          updatedAt: Date.now(),
        });
        profile = (await ctx.db.get(profile._id))!;
      }
      // Get user
      const user = await ctx.db.get(profile.userId);
      return { profile, user, isNew: false };
    }

    // 2. Create User
    // We insert a user. In the future, we might want to store more info.
    const userId = await ctx.db.insert('users', {
      name: `WhatsApp User ${formattedPhone.slice(-4)}`,
      // image: '',
    });

    // 3. Create Profile
    const profileId = await ctx.db.insert('profiles', {
      userId,
      phoneNumber: formattedPhone,
      phoneVerified: true,
      phoneVerifiedAt: Date.now(),
      updatedAt: Date.now(),
    });

    profile = (await ctx.db.get(profileId))!;
    const user = (await ctx.db.get(userId))!;

    return { profile, user, isNew: true };
  },
});
