/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as blogPosts from "../blogPosts.js";
import type * as browserLinks from "../browserLinks.js";
import type * as careerTimeline from "../careerTimeline.js";
import type * as contactMessages from "../contactMessages.js";
import type * as http from "../http.js";
import type * as media from "../media.js";
import type * as navigation from "../navigation.js";
import type * as seo from "../seo.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  blogPosts: typeof blogPosts;
  browserLinks: typeof browserLinks;
  careerTimeline: typeof careerTimeline;
  contactMessages: typeof contactMessages;
  http: typeof http;
  media: typeof media;
  navigation: typeof navigation;
  seo: typeof seo;
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
