import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { fallbackUsernameFromClerkId } from "@/lib/server/fallback-username";
import { ensureHeartsRefilledIfDue } from "@/lib/server/hearts-refill";

type EnsureUserArgs = {
  id: string;
  email?: string | null;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
};

/**
 * Ensure a `User` row exists for this Clerk id. No interactive `$transaction`:
 * parallel callers + small pools can time out waiting for a transaction slot.
 * Race on first insert is handled with P2002 → fetch + update.
 */
export async function ensureUser(args: EnsureUserArgs) {
  const { id, email, username, name, avatarUrl } = args;
  const safeEmail = email ?? `${id}@no-email.local`;
  const trimmedUsername = username?.trim();
  const trimmedName = name?.trim();
  const safeUsername =
    (trimmedUsername && trimmedUsername.length > 0
      ? trimmedUsername
      : null) ??
    (trimmedName && trimmedName.length > 0 ? trimmedName : null) ??
    fallbackUsernameFromClerkId(id);

  const updateData: Prisma.UserUpdateInput = {
    ...(email ? { email } : {}),
    ...(username?.trim() ? { userName: username.trim() } : {}),
    ...(name?.trim() ? { name: name.trim() } : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
  };

  const createData: Prisma.UserCreateInput = {
    id,
    email: safeEmail,
    userName: safeUsername,
    name: trimmedName ?? safeUsername,
    avatarUrl: avatarUrl ?? undefined,
  };

  const existing = await prisma.user.findUnique({ where: { id } });
  if (existing) {
    await ensureHeartsRefilledIfDue(id);
    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  try {
    return await prisma.user.create({ data: createData });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const afterRace = await prisma.user.findUnique({ where: { id } });
      if (afterRace) {
        await ensureHeartsRefilledIfDue(id);
        return prisma.user.update({
          where: { id },
          data: updateData,
        });
      }
    }
    throw e;
  }
}
