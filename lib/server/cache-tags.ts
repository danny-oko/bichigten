export const CACHE_TAG_LEADERBOARD = "cache:leaderboard";
export const CACHE_TAG_CATALOG = "cache:catalog";
export const CACHE_TAG_SPEECH = "cache:speech";

export function cacheTagUser(userId: string) {
  return `cache:user:${userId}`;
}
