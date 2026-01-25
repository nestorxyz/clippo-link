import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserId } from './users';

export const currentProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query('profiles')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
  },
});

export const getByPhoneNumber = query({
  args: {
    phoneNumber: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid Secret');
    }
    return await ctx.db
      .query('profiles')
      .withIndex('by_phone', (q) => q.eq('phoneNumber', args.phoneNumber))
      .first();
  },
});

export const getOrCreateByPhone = mutation({
  args: {
    phoneNumber: v.string(),
    secret: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CONVEX_BACKEND_SECRET) {
      throw new Error('Unauthorized: Invalid Secret');
    }
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
      name: `WhatsApp User ${formattedPhone}`,
      // image: '',
    });

    // 3. Create Profile
    const profileId = await ctx.db.insert('profiles', {
      userId,
      phoneNumber: formattedPhone,
      phoneVerified: true,
      phoneVerifiedAt: Date.now(),
      updatedAt: Date.now(),
      createdVia: 'whatsapp',
    });

    profile = (await ctx.db.get(profileId))!;
    const user = (await ctx.db.get(userId))!;

    return { profile, user, isNew: true };
  },
});
