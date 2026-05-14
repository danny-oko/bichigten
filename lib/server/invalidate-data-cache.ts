import { revalidateTag } from "next/cache";

import {
  CACHE_TAG_CATALOG,
  CACHE_TAG_LEADERBOARD,
  CACHE_TAG_SPEECH,
  cacheTagUser,
} from "@/lib/server/cache-tags";

const revalidateTagProfile = "max" as const;

function invalidate(tag: string) {
  revalidateTag(tag, revalidateTagProfile);
}

export function invalidateAfterProgressWrite(userId: string) {
  invalidate(cacheTagUser(userId));
  invalidate(CACHE_TAG_LEADERBOARD);
  invalidate(CACHE_TAG_SPEECH);
}

export function invalidateAfterCatalogMutation() {
  invalidate(CACHE_TAG_CATALOG);
}

export function invalidateAfterSpeechMutation() {
  invalidate(CACHE_TAG_SPEECH);
}

export function invalidateAfterUserRowMutation(userId: string) {
  invalidate(cacheTagUser(userId));
  invalidate(CACHE_TAG_LEADERBOARD);
}

export function invalidateAfterLeaderboardPoolChange() {
  invalidate(CACHE_TAG_LEADERBOARD);
}
