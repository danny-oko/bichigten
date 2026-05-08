import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
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

  const clerkUser = await currentUser();
  const primaryEmail = clerkUser?.emailAddresses.find(
    (entry) => entry.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;

  const fallbackEmail = `${userId}@no-email.local`;
  const email = primaryEmail ?? fallbackEmail;
  const username =
    clerkUser?.username ??
    clerkUser?.firstName?.toLowerCase().replace(/\s+/g, "-") ??
    `user-${userId.slice(0, 8)}`;
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ").trim() ||
    username;

  const existing = await prisma.user.findUnique({ where: { id: userId } });
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

  // Don't overwrite user-edited profile fields on every request.
  // Only fill missing values from Clerk, while keeping email in sync.
  return prisma.user.update({
    where: { id: userId },
    data: {
      email,
      ...(existing.userName ? {} : { userName: username }),
      ...(existing.name ? {} : { name }),
      ...(existing.avatarUrl ? {} : { avatarUrl: clerkUser?.imageUrl ?? undefined }),
    },
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
