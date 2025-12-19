"use client";

import { useAuth } from "@clerk/nextjs";
import type { Tier } from "@/lib/constants";

/**
 * Client-side hook to get the current user's subscription tier.
 * Uses Clerk's useAuth() to check plan subscriptions.
 */
export function useUserTier(): Tier {
  const { has } = useAuth();

  if (has?.({ plan: "ultra" })) return "ultra";
  if (has?.({ plan: "pro" })) return "pro";
  return "free";
}

/**
 * Check if a user tier has access to content at the specified tier.
 *
 * - Free content (or no tier specified): accessible to everyone
 * - Pro content: requires pro or ultra plan
 * - Ultra content: requires ultra plan
 */
export function hasTierAccess(
  userTier: Tier,
  contentTier: Tier | null | undefined
): boolean {
  // Free content or no tier = accessible to everyone
  if (!contentTier || contentTier === "free") return true;

  // Ultra content requires ultra plan
  if (contentTier === "ultra") return userTier === "ultra";

  // Pro content requires pro OR ultra plan
  if (contentTier === "pro") return userTier === "pro" || userTier === "ultra";

  return false;
}