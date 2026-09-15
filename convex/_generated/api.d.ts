/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as billing from "../billing.js";
import type * as categories from "../categories.js";
import type * as chat from "../chat.js";
import type * as http from "../http.js";
import type * as import_data from "../import_data.js";
import type * as lib_normalizeSavedUrl from "../lib/normalizeSavedUrl.js";
import type * as links from "../links.js";
import type * as migrations from "../migrations.js";
import type * as polar from "../polar.js";
import type * as storage from "../storage.js";
import type * as subCategories from "../subCategories.js";
import type * as tags from "../tags.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  billing: typeof billing;
  categories: typeof categories;
  chat: typeof chat;
  http: typeof http;
  import_data: typeof import_data;
  "lib/normalizeSavedUrl": typeof lib_normalizeSavedUrl;
  links: typeof links;
  migrations: typeof migrations;
  polar: typeof polar;
  storage: typeof storage;
  subCategories: typeof subCategories;
  tags: typeof tags;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
