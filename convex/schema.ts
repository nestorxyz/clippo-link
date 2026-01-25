import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
  })
    .index('by_token', ['tokenIdentifier'])
    .index('by_email', ['email']),

  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  subCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id('categories'),
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_category', ['categoryId'])
    .index('by_user', ['userId']),

  links: defineTable({
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    imgPreview: v.optional(v.string()),
    subCategoryId: v.optional(v.id('subCategories')),
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
    source: v.optional(v.string()),
    content: v.optional(v.string()),
    isFavorite: v.boolean(),
    isReadLater: v.boolean(),
  })
    .index('by_subCategory', ['subCategoryId'])
    .index('by_user', ['userId']),

  tags: defineTable({
    name: v.string(),
    color: v.string(),
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  linkTags: defineTable({
    linkId: v.id('links'),
    tagId: v.id('tags'),
    createdAt: v.number(),
  })
    .index('by_link', ['linkId'])
    .index('by_tag', ['tagId']),

  chatSessions: defineTable({
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
    source: v.optional(v.string()), // 'web', 'whatsapp', etc.
  })
    .index('by_user', ['userId'])
    .index('by_user_source', ['userId', 'source']),

  chatMessages: defineTable({
    sessionId: v.id('chatSessions'),
    role: v.string(),
    parts: v.any(), // JSON content
    createdAt: v.number(),
  }).index('by_session', ['sessionId']),

  profiles: defineTable({
    userId: v.id('users'),
    phoneNumber: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    phoneVerifiedAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdVia: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_phone', ['phoneNumber']),

  otpAttempts: defineTable({
    userId: v.id('users'),
    phoneNumber: v.string(),
    otpCode: v.string(),
    attemptType: v.string(),
    verified: v.boolean(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  subscriptions: defineTable({
    userId: v.id('users'),
    lemonSubscriptionId: v.string(),
    productId: v.optional(v.string()),
    variantId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    status: v.string(),
    trialEndsAt: v.optional(v.number()),
    renewsAt: v.number(),
    endsAt: v.optional(v.number()),
    cardBrand: v.optional(v.string()),
    cardLastFour: v.optional(v.string()),
    updatePaymentMethodUrl: v.optional(v.string()),
    customerPortalUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_lemon_subscription_id', ['lemonSubscriptionId']),

  subscriptionWebhookEvents: defineTable({
    eventName: v.string(),
    lemonObjectType: v.string(),
    lemonObjectId: v.string(),
    eventKey: v.string(),
    rawPayload: v.any(),
    signature: v.optional(v.string()),
    receivedAt: v.number(),
    duplicate: v.boolean(),
  }).index('by_event_key', ['eventKey']),
});
