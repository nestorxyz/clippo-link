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
    userId: v.id('users'), // Mapping retired-provider user_id to Convex User ID
    createdAt: v.optional(v.string()), // Or v.number() for timestamp, sticking to string for ISO dates often used
  }).index('by_user', ['userId']),

  subCategories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.id('categories'),
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
  })
    .index('by_category', ['categoryId'])
    .index('by_user', ['userId']),

  links: defineTable({
    url: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    imgPreview: v.optional(v.string()),
    subCategoryId: v.optional(v.id('subCategories')), // Optional or required? retired-provider schema check might be needed, assuming optional for now or based on hierarchy
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
  })
    .index('by_subCategory', ['subCategoryId'])
    .index('by_user', ['userId']),

  tags: defineTable({
    name: v.string(),
    color: v.string(), // Hex color
    userId: v.id('users'),
  }).index('by_user', ['userId']),

  linkTags: defineTable({
    linkId: v.id('links'),
    tagId: v.id('tags'),
  })
    .index('by_link', ['linkId'])
    .index('by_tag', ['tagId']),

  chatSessions: defineTable({
    userId: v.id('users'),
    createdAt: v.optional(v.string()),
  }).index('by_user', ['userId']),

  chatMessages: defineTable({
    sessionId: v.id('chatSessions'),
    role: v.string(),
    parts: v.any(), // JSON content
    createdAt: v.optional(v.string()),
  }).index('by_session', ['sessionId']),

  profiles: defineTable({
    userId: v.id('users'),
    phoneNumber: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    phoneVerifiedAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_phone', ['phoneNumber']),
});
