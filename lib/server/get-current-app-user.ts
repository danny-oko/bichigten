import { auth, currentUser } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { fallbackUsernameFromClerkId } from "@/lib/server/fallback-username";
import {
  getDevImpersonatedUserId,
  isDevPostmanBypassRequest,
} from "@/lib/server/dev-postman-bypass";

/** Clerk session user id, or dev Postman `x-impersonate-user-id` when bypass headers are set. */
export async function getClerkUserIdFromRequest(req: Request): Promise<string | null> {
  if (isDevPostmanBypassRequest(req)) {
    return getDevImpersonatedUserId(req);
  }
  const { userId } = await auth();
  return userId ?? null;
}

export async function getCurrentAppUser() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const [existing, clerkUser] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    currentUser(),
  ]);

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

  const username =
    clerkUser?.username?.trim() ||
    (fromFirstName.length >= 3 ? fromFirstName : "") ||
    usernameFromEmail ||
    fallbackUsernameFromClerkId(userId);

  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser?.username?.trim() ||
    (emailLocal.length >= 2 ? emailLocal : "") ||
    username;

  if (!existing) {
    return prisma.user.create({
      data: {
        id: userId,
        email,
        userName: username,
        name,
        avatarUrl: clerkUser?.imageUrl ?? undefined,
      },
    });
  }

  const data: Prisma.UserUpdateInput = {};
  if (existing.email !== email) {
    data.email = email;
  }
  if (existing.userName?.startsWith("user-user_")) {
    data.userName = username;
  }
  if (
    existing.name?.startsWith("user-user_") ||
    (existing.name === existing.userName &&
      existing.userName?.startsWith("user-user_"))
  ) {
    data.name = name;
  }
  if (!existing.userName && username) {
    data.userName = username;
  }
  if (!existing.name && name) {
    data.name = name;
  }
  if (!existing.avatarUrl && clerkUser?.imageUrl) {
    data.avatarUrl = clerkUser.imageUrl;
  }

  if (Object.keys(data).length === 0) {
    return existing;
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Same as getCurrentAppUser, but in development with valid Postman headers
 * returns the DB user for `x-impersonate-user-id` (no Clerk session needed).
 */
export async function getCurrentAppUserFromRequest(req: Request) {
  if (isDevPostmanBypassRequest(req)) {
    const id = getDevImpersonatedUserId(req);
    if (!id) {
      return null;
    }
    return prisma.user.findUnique({ where: { id } });
  }

  return getCurrentAppUser();
}
