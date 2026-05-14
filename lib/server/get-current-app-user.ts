import { auth, currentUser } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  deriveAppUserFieldsFromClerk,
  isProvisionalDbUsername,
} from "@/lib/server/clerk-to-db-user-fields";
import { withDbRetry } from "@/lib/server/db-retry";
import { fallbackUsernameFromClerkId } from "@/lib/server/fallback-username";
import { ensureHeartsRefilledIfDue } from "@/lib/server/hearts-refill";
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

  await ensureHeartsRefilledIfDue(userId);

  /** Avoid `Promise.all` with DB + Clerk: two outbound calls at once can worsen pool
   *  contention; transient "Server has closed the connection" is retried below. */
  const existing = await withDbRetry(() =>
    prisma.user.findUnique({ where: { id: userId } }),
  );
  const clerkUser = await currentUser();

  const { email, userName: username, name, avatarUrl } =
    deriveAppUserFieldsFromClerk(userId, clerkUser);

  if (!existing) {
    return withDbRetry(() =>
      prisma.user.create({
        data: {
          id: userId,
          email,
          userName: username,
          name,
          avatarUrl: avatarUrl ?? undefined,
        },
      }),
    );
  }

  const data: Prisma.UserUpdateInput = {};
  if (existing.email !== email) {
    data.email = email;
  }

  const hadBadUserName = isProvisionalDbUsername(userId, existing.userName);
  if (hadBadUserName && username) {
    data.userName = username;
  } else if (!existing.userName && username) {
    data.userName = username;
  }

  const hadBadName =
    isProvisionalDbUsername(userId, existing.name) ||
    existing.name?.startsWith("user-user_") ||
    (existing.name === existing.userName && hadBadUserName);

  if (hadBadName && name) {
    data.name = name;
  } else if (!existing.name && name) {
    data.name = name;
  }

  if (!existing.avatarUrl && avatarUrl) {
    data.avatarUrl = avatarUrl;
  }

  if (Object.keys(data).length === 0) {
    return existing;
  }

  return withDbRetry(() =>
    prisma.user.update({
      where: { id: userId },
      data,
    }),
  );
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
    await ensureHeartsRefilledIfDue(id);
    return prisma.user.findUnique({ where: { id } });
  }

  return getCurrentAppUser();
}
