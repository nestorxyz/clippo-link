import { createClient } from '@retired-provider/retired-provider-js';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const retired-provider_URL = process.env.retired-provider_URL;
const retired-provider_SERVICE_KEY = process.env.retired-provider_SERVICE_ROLE_KEY;
const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_DEPLOYMENT;

if (!retired-provider_URL || !retired-provider_SERVICE_KEY || !CONVEX_URL) {
  console.error('Missing required environment variables.');
  console.log('retired-provider_URL:', !!retired-provider_URL);
  console.log('retired-provider_SERVICE_ROLE_KEY:', !!retired-provider_SERVICE_KEY);
  console.log('CONVEX_URL:', !!CONVEX_URL);
  process.exit(1);
}

const retired-provider = createClient(retired-provider_URL, retired-provider_SERVICE_KEY);
const convex = new ConvexHttpClient(CONVEX_URL);

// Maps to store Old ID -> New ID
const userIdMap = new Map<string, string>(); // retired-provider User ID -> Convex User ID
const categoryIdMap = new Map<string, string>();
const subCategoryIdMap = new Map<string, string>();
const tagIdMap = new Map<string, string>();
// Link IDs don't necessarily need mapping for dependencies, but good to traverse.

const migrate = async () => {
  console.log('Starting migration...');

  // 1. Map Users
  console.log('Mapping users...');
  const {
    data: { users },
    error: usersError,
  } = await retired-provider.auth.admin.listUsers();
  if (usersError) throw usersError;

  for (const user of users) {
    if (user.email) {
      // Try to find user, or create if missing
      let convexUserId = await convex.mutation(api.import_data.getUserByEmail, {
        email: user.email,
      });

      if (!convexUserId) {
        console.log(`User ${user.email} not found. Creating...`);
        // Map metadata name/image if available
        const name =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email.split('@')[0];
        const image =
          user.user_metadata?.avatar_url || user.user_metadata?.picture;

        convexUserId = await convex.mutation(api.import_data.importUser, {
          email: user.email,
          name: name,
          image: image,
          createdAt: user.created_at,
        });
      }

      if (convexUserId) {
        userIdMap.set(user.id, convexUserId);
        console.log(
          `Mapped user ${user.email} (${user.id}) -> ${convexUserId}`
        );
      }
    }
  }

  // 1a. Migrate Profiles (Phone Numbers)
  console.log('Migrating Profiles...');
  const { data: profiles, error: profError } = await retired-provider
    .from('profiles')
    .select('*');
  if (profError) {
    console.warn(
      'Could not fetch profiles (table might not exist or permission denied):',
      profError.message
    );
  } else {
    for (const profile of profiles || []) {
      // profile.id is the auth.users.id in retired-provider
      const convexUserId = userIdMap.get(profile.id);
      if (!convexUserId) {
        // This might happen if we failed to map/create the user earlier (e.g. no email)
        continue;
      }

      await convex.mutation(api.import_data.importProfile, {
        userId: convexUserId as any,
        phoneNumber: profile.phone_number ?? undefined,
        phoneVerified: profile.phone_verified ?? undefined,
        phoneVerifiedAt: profile.phone_verified_at ?? undefined,
        updatedAt: profile.updated_at ?? undefined,
      });
    }
    console.log(`Migrated ${profiles?.length} profiles.`);
  }

  // 2. Migrate Tags
  console.log('Migrating Tags...');
  const { data: tags, error: tagsError } = await retired-provider
    .from('tags')
    .select('*');
  if (tagsError) throw tagsError;

  for (const tag of tags || []) {
    const convexUserId = userIdMap.get(tag.user_id);
    if (!convexUserId) continue;

    const newTagId = await convex.mutation(api.import_data.importTag, {
      name: tag.name,
      color: tag.color || '#000000',
      userId: convexUserId as any,
    });
    tagIdMap.set(tag.id, newTagId);
  }
  console.log(`Migrated ${tags?.length} tags.`);

  // 3. Migrate Categories
  console.log('Migrating Categories...');
  const { data: categories, error: catsError } = await retired-provider
    .from('categories')
    .select('*');
  if (catsError) throw catsError;

  for (const cat of categories || []) {
    const convexUserId = userIdMap.get(cat.user_id);
    if (!convexUserId) continue;

    const newCatId = await convex.mutation(api.import_data.importCategory, {
      originalId: cat.id,
      name: cat.name,
      description: cat.description ?? undefined,
      userId: convexUserId as any,
      createdAt: cat.created_at,
    });
    categoryIdMap.set(cat.id, newCatId);
  }
  console.log(`Migrated ${categories?.length} categories.`);

  // 4. Migrate SubCategories
  console.log('Migrating SubCategories...');
  const { data: subCategories, error: subCatsError } = await retired-provider
    .from('sub_categories')
    .select('*');
  if (subCatsError) throw subCatsError;

  for (const sub of subCategories || []) {
    const convexUserId = userIdMap.get(sub.user_id);
    const convexCategoryId = categoryIdMap.get(sub.category_id);
    if (!convexUserId || !convexCategoryId) continue;

    const newSubId = await convex.mutation(api.import_data.importSubCategory, {
      name: sub.name,
      description: sub.description ?? undefined,
      categoryId: convexCategoryId as any,
      userId: convexUserId as any,
      createdAt: sub.created_at,
    });
    subCategoryIdMap.set(sub.id, newSubId);
  }
  console.log(`Migrated ${subCategories?.length} subcategories.`);

  // 5. Migrate Links & LinkTags
  console.log('Migrating Links...');
  const { data: links, error: linksError } = await retired-provider.from('links')
    .select(`
    *,
    link_tags (
      tag_id
    )
  `);
  if (linksError) throw linksError;

  for (const link of links || []) {
    const convexUserId = userIdMap.get(link.user_id);
    // Subcategory is optional? If null, stays null. If exists, must map.
    const convexSubCategoryId = link.sub_category_id
      ? subCategoryIdMap.get(link.sub_category_id)
      : undefined;

    // If subcategory was present but map failed, we might want to skip or warn?
    // Assuming for now if sub_category_id existed but map failed, it might belong to excluded user or deleted cat.
    if (!convexUserId) continue;

    // Resolve Tags
    const mappedTagIds: any[] = [];
    if (link.link_tags && Array.isArray(link.link_tags)) {
      for (const lt of link.link_tags) {
        const newTagId = tagIdMap.get(lt.tag_id);
        if (newTagId) mappedTagIds.push(newTagId);
      }
    }

    await convex.mutation(api.import_data.importLink, {
      url: link.url,
      title: link.title,
      description: link.description ?? undefined,
      imgPreview: (link.img_preview || link.image_url) ?? undefined, // Handle field name variation if any
      subCategoryId: convexSubCategoryId as any,
      userId: convexUserId as any,
      createdAt: link.created_at,
      tagIds: mappedTagIds,
    });
  }
  console.log(`Migrated ${links?.length} links.`);

  // 6. Migrate Chat History
  console.log('Migrating Chat History...');
  const { data: sessions, error: sessionError } = await retired-provider
    .from('chat_sessions')
    .select('*');
  if (sessionError) throw sessionError;

  for (const session of sessions || []) {
    const convexUserId = userIdMap.get(session.user_id);
    if (!convexUserId) continue;

    // Create Session
    const newSessionId = await convex.mutation(
      api.import_data.importChatSession,
      {
        userId: convexUserId as any,
        createdAt: session.created_at,
      }
    );

    // Fetch Messages for this session
    const { data: messages, error: msgError } = await retired-provider
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    if (msgError)
      console.warn('Error fetching messages for session', session.id);

    if (messages) {
      for (const msg of messages) {
        await convex.mutation(api.import_data.importChatMessage, {
          sessionId: newSessionId,
          role: msg.role,
          parts: msg.parts,
          createdAt: msg.created_at,
        });
      }
    }
  }
  console.log(`Migrated ${sessions?.length} chat sessions.`);

  console.log('Migration complete!');
};

migrate().catch(console.error);
