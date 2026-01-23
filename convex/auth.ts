import { action, internalMutation, mutation } from './_generated/server';
import { v } from 'convex/values';
import { internal, api } from './_generated/api';

const OTP_EXPIRY_MINUTES = 10;
const OTP_COOLDOWN_SECONDS = 30;

// Helper to format phone number (simple version)
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-numeric characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  // Start with +
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

export const generateOtp = internalMutation({
  args: {
    userId: v.id('users'),
    phoneNumber: v.string(),
    attemptType: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, phoneNumber, attemptType } = args;
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const now = Date.now();
    const recentCutoff = now - OTP_COOLDOWN_SECONDS * 1000;

    // Check for recent OTP requests
    const recentAttempts = await ctx.db
      .query('otpAttempts')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) =>
        q.and(
          q.eq(q.field('phoneNumber'), formattedPhone),
          q.gte(q.field('createdAt'), recentCutoff),
        ),
      )
      .first();

    if (recentAttempts) {
      throw new Error(
        `Please wait ${OTP_COOLDOWN_SECONDS} seconds before requesting another OTP`,
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Calculate expiry time
    const expiresAt = now + OTP_EXPIRY_MINUTES * 60 * 1000;

    await ctx.db.insert('otpAttempts', {
      userId,
      phoneNumber: formattedPhone,
      otpCode: otp,
      attemptType,
      verified: false,
      createdAt: now,
      expiresAt,
    });

    return { otp };
  },
});

export const sendOtp = action({
  args: {
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    // Get user from DB to get ID
    const user = await ctx.runQuery(api.users.current);
    if (!user) throw new Error('User not found');

    const formattedPhone = formatPhoneNumber(args.phoneNumber);

    try {
      // Generate OTP record
      const { otp } = await ctx.runMutation(internal.auth.generateOtp, {
        userId: user._id,
        phoneNumber: formattedPhone,
        attemptType: 'web_verification',
      });

      // Send via WhatsApp
      await ctx.runAction(internal.whatsapp.sendOTP, {
        phoneNumber: formattedPhone,
        otpCode: otp,
      });

      return {
        success: true,
        message: 'OTP sent successfully via WhatsApp',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

export const verifyOtp = mutation({
  args: {
    phoneNumber: v.string(),
    otpCode: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const { phoneNumber, otpCode } = args;
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error('User not found');

    // Find valid OTP
    const now = Date.now();
    const otpAttempt = await ctx.db
      .query('otpAttempts')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field('phoneNumber'), formattedPhone),
          q.eq(q.field('otpCode'), otpCode),
          q.eq(q.field('verified'), false),
          q.gte(q.field('expiresAt'), now),
        ),
      )
      .order('desc')
      .first();

    if (!otpAttempt) {
      return {
        success: false,
        error: 'Invalid or expired OTP',
      };
    }

    // Mark as verified
    await ctx.db.patch(otpAttempt._id, { verified: true });

    // Link phone to user (Delegating to users mutation logic, but since we are inside a mutation we can call another mutation logic function if extracted, or just call the mutation via ctx.runMutation if it was an action. Since we are in a mutation, we can't call another public mutation directly easily unless we structure it right, or we just duplicate/import logic.
    // However, verifyOtp is a mutation. We can just do the linking here or call a helper.)

    // Let's replicate the logic of 'linkPhoneToUser' here for now, or better yet, make `linkPhone` a mutation and call it?
    // You cannot call a mutation from another mutation in Convex safely via `ctx.runMutation` (that is for actions).
    // So we will import the logic or just implement it here.
    // Actually, following the plan, we should have a `linkPhone` mutation. But `verifyOtp` needs to be atomic with it?
    // The previous backend had `verifyOtp` and `linkPhoneToUser` as separate steps in the controller but `verifyOtp` just verified the code.
    // Here we want to do it in one go for better UX/consistency.

    // Check if phone is already taken
    const existingProfileWithPhone = await ctx.db
      .query('profiles')
      .withIndex('by_phone', (q) => q.eq('phoneNumber', formattedPhone))
      .unique();

    if (
      existingProfileWithPhone &&
      existingProfileWithPhone.userId !== user._id
    ) {
      // If it's a WhatsApp-only account (we'll check createdVia if it exists), offer consolidation.
      // The original schema had createdVia.
      if (existingProfileWithPhone.createdVia === 'whatsapp') {
        return {
          success: false,
          error: 'CONSOLIDATION_REQUIRED',
          data: {
            whatsappAccountId: existingProfileWithPhone.userId,
            phoneNumber: formattedPhone,
          },
        };
      }
      return {
        success: false,
        error: 'Phone number already in use',
      };
    }

    // Update profile
    const userProfile = await ctx.db
      .query('profiles')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .unique();

    if (userProfile) {
      await ctx.db.patch(userProfile._id, {
        phoneNumber: formattedPhone,
        phoneVerified: true,
        phoneVerifiedAt: now,
      });
    } else {
      await ctx.db.insert('profiles', {
        userId: user._id,
        phoneNumber: formattedPhone,
        phoneVerified: true,
        phoneVerifiedAt: now,
      });
    }

    return {
      success: true,
      message: 'Phone number verified and linked successfully',
      data: { phoneNumber: formattedPhone },
    };
  },
});
