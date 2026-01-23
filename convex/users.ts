import { v } from 'convex/values';
import { mutation, query, QueryCtx, MutationCtx } from './_generated/server';

export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  const user = await ctx.db
    .query('users')
    .withIndex('by_token', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier),
    )
    .unique();
  return user?._id;
}

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const updateAvatar = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new Error('Called updateAvatar without authentication present');
    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error('Failed to get file URL');

    await ctx.db.patch(userId, {
      image: url,
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique();
    return user;
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called storeUser without authentication present');
    }

    // Check if we've already stored this identity or if it's a new user.
    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    // Checking for existing user by email (User Reconciliation)
    const existingUserByEmail = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', identity.email))
      .unique();

    if (existingUserByEmail) {
      // Link the new identity to the existing user
      await ctx.db.patch(existingUserByEmail._id, {
        tokenIdentifier: identity.tokenIdentifier,
        name: identity.name,
        // We can update the image too if needed, or keep the old one
        image: identity.pictureUrl || existingUserByEmail.image,
      });
      return existingUserByEmail._id;
    }

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert('users', {
      name: identity.name,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      image: identity.pictureUrl,
    });
  },
});

export const consolidateAccount = mutation({
  args: {
    whatsappAccountId: v.id('users'),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier),
      )
      .unique();

    if (!currentUser) throw new Error('User not found');

    const { whatsappAccountId, phoneNumber } = args;

    // Verify the WhatsApp account exists and is valid for consolidation
    const whatsappUser = await ctx.db.get(whatsappAccountId);
    if (!whatsappUser) throw new Error('WhatsApp account not found');

    // Security check: Ensure the phone number matches the one in the profile of the WhatsApp account
    // (Assuming we trust the client to pass the correct ID, but better to verify phone ownership again?
    //  The client just proved ownership via OTP to get here, but we should double check the DB state)
    // Actually, the previous flow was:
    // 1. Verify OTP -> returns CONSOLIDATION_REQUIRED with whatsappAccountId
    // 2. Client calls consolidateAccount with that ID.
    // We should strictly verify that the whatsappAccountId provided indeed has the phone number we just verified.
    const whatsappProfile = await ctx.db
      .query('profiles')
      .withIndex('by_user', (q) => q.eq('userId', whatsappAccountId))
      .unique();

    if (!whatsappProfile) throw new Error('WhatsApp profile not found');

    // Normalize phone numbers for comparison
    const cleanArgPhone = phoneNumber.replace(/[^\d+]/g, '');
    const cleanProfilePhone = (whatsappProfile.phoneNumber || '').replace(
      /[^\d+]/g,
      '',
    );

    if (cleanArgPhone !== cleanProfilePhone) {
      throw new Error('Phone number mismatch for the account to consolidate');
    }

    // Move Categories
    const categories = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', whatsappAccountId))
      .collect();

    const currentUserCategories = await ctx.db
      .query('categories')
      .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
      .collect();

    const categoryMapping: Record<string, string> = {};

    for (const cat of categories) {
      const existing = currentUserCategories.find(
        (c) => c.name.toLowerCase() === cat.name.toLowerCase(),
      );

      if (existing) {
        categoryMapping[cat._id] = existing._id;
        // Delete the duplicate category from old account
        await ctx.db.delete(cat._id);
      } else {
        // Move category to new user
        await ctx.db.patch(cat._id, { userId: currentUser._id });
        categoryMapping[cat._id] = cat._id;
      }
    }

    // Move SubCategories
    const subCategories = await ctx.db
      .query('subCategories')
      .withIndex('by_user', (q) => q.eq('userId', whatsappAccountId))
      .collect();

    for (const sub of subCategories) {
      const newCategoryId =
        (categoryMapping[sub.categoryId] as any) || sub.categoryId;

      await ctx.db.patch(sub._id, {
        userId: currentUser._id,
        categoryId: newCategoryId,
      });
    }

    // Move Links
    const links = await ctx.db
      .query('links')
      .withIndex('by_user', (q) => q.eq('userId', whatsappAccountId))
      .collect();

    for (const link of links) {
      await ctx.db.patch(link._id, { userId: currentUser._id });
    }

    // Move Tags
    const tags = await ctx.db
      .query('tags')
      .withIndex('by_user', (q) => q.eq('userId', whatsappAccountId))
      .collect();

    const currentUserTags = await ctx.db
      .query('tags')
      .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
      .collect();

    for (const tag of tags) {
      const existing = currentUserTags.find(
        (t) => t.name.toLowerCase() === tag.name.toLowerCase(),
      );

      if (existing) {
        // Remap links that used this tag
        const linkTags = await ctx.db
          .query('linkTags')
          .withIndex('by_tag', (q) => q.eq('tagId', tag._id))
          .collect();

        for (const lt of linkTags) {
          // Check if the link already has this tag (to avoid duplicate linkTags)
          const alreadyHasTag = await ctx.db
            .query('linkTags')
            .withIndex('by_link', (q) => q.eq('linkId', lt.linkId))
            .filter((q) => q.eq(q.field('tagId'), existing._id))
            .first();

          if (!alreadyHasTag) {
            await ctx.db.patch(lt._id, { tagId: existing._id });
          } else {
            // Duplicate, remove the old one
            await ctx.db.delete(lt._id);
          }
        }
        await ctx.db.delete(tag._id);
      } else {
        await ctx.db.patch(tag._id, { userId: currentUser._id });
      }
    }

    // Cleanup WhatsApp account
    // 1. Remove phone from old profile
    if (whatsappProfile) {
      await ctx.db.delete(whatsappProfile._id);
    }

    // 2. Delete the user record itself?
    // Usually safest to just leave it empty or mark deleted if we had a flag.
    // Given the task says "Delete WhatsApp account", we can try `ctx.db.delete(whatsappAccountId)`.
    await ctx.db.delete(whatsappAccountId);

    // Update current user profile with new phone
    const currentProfile = await ctx.db
      .query('profiles')
      .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
      .unique();

    if (currentProfile) {
      await ctx.db.patch(currentProfile._id, {
        phoneNumber: phoneNumber,
        phoneVerified: true,
        phoneVerifiedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('profiles', {
        userId: currentUser._id,
        phoneNumber: phoneNumber,
        phoneVerified: true,
        phoneVerifiedAt: Date.now(),
      });
    }

    return {
      success: true,
      message: 'Accounts consolidated successfully',
      data: { phone_number: phoneNumber },
    };
  },
});
