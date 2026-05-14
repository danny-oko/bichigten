/**
 * Stable Prisma `userName` when Clerk has no username (3–20 chars, `[a-zA-Z0-9_]`).
 *
 * Avoids `user-${clerkId.slice(0, 8)}`: Clerk ids start with `user_`, which produced
 * values like `user-user_3Dh…` in the UI.
 */
export function fallbackUsernameFromClerkId(clerkUserId: string): string {
  const tail = clerkUserId
    .replace(/^user_/i, "")
    .replace(/[^a-zA-Z0-9]/g, "");
  const core = (
    tail.length >= 3 ? tail : `id${clerkUserId.replace(/\W/g, "").slice(-10)}`
  ).slice(0, 17);
  return `u_${core}`.slice(0, 20);
}
