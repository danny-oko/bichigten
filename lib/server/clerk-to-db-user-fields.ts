import type { User } from "@clerk/nextjs/server";

import { fallbackUsernameFromClerkId } from "@/lib/server/fallback-username";

/** DB row fields derived from Clerk (same rules as `getCurrentAppUser`). */
export function deriveAppUserFieldsFromClerk(
  userId: string,
  clerkUser: User | null | undefined,
) {
  const primaryEmail = clerkUser?.emailAddresses.find(
    (entry) => entry.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;

  const emailLocal =
    primaryEmail && primaryEmail.includes("@")
      ? primaryEmail
          .split("@")[0]
          .replace(/[^a-zA-Z0-9._-]/g, "")
          .slice(0, 20)
      : "";

  const fallbackEmail = `${userId}@no-email.local`;
  const email = primaryEmail ?? fallbackEmail;

  const fromFirstName = clerkUser?.firstName
    ? clerkUser.firstName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 20)
    : "";

  const emailLocalSlug = emailLocal
    .replace(/\./g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 20);

  const usernameFromEmail =
    emailLocalSlug.length >= 3 && /^[a-zA-Z0-9_]{3,20}$/.test(emailLocalSlug)
      ? emailLocalSlug
      : "";

  const userName =
    clerkUser?.username?.trim() ||
    (fromFirstName.length >= 3 ? fromFirstName : "") ||
    usernameFromEmail ||
    fallbackUsernameFromClerkId(userId);

  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser?.username?.trim() ||
    (emailLocal.length >= 2 ? emailLocal : "") ||
    userName;

  return {
    email,
    userName,
    name,
    avatarUrl: clerkUser?.imageUrl ?? null,
  };
}

/** Synthetic username saved when Clerk data was not loaded yet (`ensureUser({ id })`). */
export function isProvisionalDbUsername(
  clerkUserId: string,
  stored: string | null | undefined,
): boolean {
  if (!stored) return false;
  if (stored.startsWith("user-user_")) return true;
  return stored === fallbackUsernameFromClerkId(clerkUserId);
}
