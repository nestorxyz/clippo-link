import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

export const grant = internalMutation({
  args: {
    userId: v.id('users'),
    expectedEmail: v.string(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (
      !user?.email ||
      user.email.trim().toLowerCase() !== args.expectedEmail.trim().toLowerCase()
    ) {
      throw new Error('USER_ID_EMAIL_MISMATCH');
    }

    const now = Date.now();
    if (args.expiresAt !== undefined && args.expiresAt <= now) {
      throw new Error('EXPIRATION_MUST_BE_IN_THE_FUTURE');
    }

    const existing = user.ownerPremiumAccess;
    if (
      existing &&
      existing.revokedAt === undefined &&
      existing.expiresAt === args.expiresAt
    ) {
      return { userId: user._id, alreadyGranted: true };
    }

    await ctx.db.patch(user._id, {
      ownerPremiumAccess: {
        grantedAt: now,
        ...(args.expiresAt === undefined ? {} : { expiresAt: args.expiresAt }),
      },
    });
    return { userId: user._id, alreadyGranted: false };
  },
});

export const revoke = internalMutation({
  args: {
    userId: v.id('users'),
    expectedEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (
      !user?.email ||
      user.email.trim().toLowerCase() !== args.expectedEmail.trim().toLowerCase()
    ) {
      throw new Error('USER_ID_EMAIL_MISMATCH');
    }

    if (!user.ownerPremiumAccess || user.ownerPremiumAccess.revokedAt !== undefined) {
      return { userId: user._id, alreadyRevoked: true };
    }

    await ctx.db.patch(user._id, {
      ownerPremiumAccess: {
        ...user.ownerPremiumAccess,
        revokedAt: Date.now(),
      },
    });
    return { userId: user._id, alreadyRevoked: false };
  },
});
