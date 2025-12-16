// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Token for fetching draft content (optional - set false to silence warning if not using drafts)
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Provide tokens for draft content support, or set to false to silence warnings
  serverToken: token || false,
  browserToken: token || false,
});