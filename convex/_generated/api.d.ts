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
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as seedBlogPosts from "../seedBlogPosts.js";
import type * as seo from "../seo.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  blogPosts: typeof blogPosts;
  browserLinks: typeof browserLinks;
  careerTimeline: typeof careerTimeline;
  contactMessages: typeof contactMessages;
  crons: typeof crons;
  http: typeof http;
  seedBlogPosts: typeof seedBlogPosts;
  seo: typeof seo;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
