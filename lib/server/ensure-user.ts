import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

type EnsureUserArgs = {
  id: string;
  email?: string | null;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
};

export async function ensureUser(args: EnsureUserArgs) {
  const { id, email, username, name, avatarUrl } = args;
  const safeEmail = email ?? `${id}@no-email.local`;
  /** Full id avoids @unique collisions when Clerk omits username (slice(0,8) could clash). */
  const safeUsername = username ?? name ?? `user-${id}`;

  const updateData: Prisma.UserUpdateInput = {
    ...(email ? { email } : {}),
    ...(username ? { userName: username } : {}),
    ...(name ? { name } : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
  };

  const existing = await prisma.user.findUnique({ where: { id } });
  if (existing) {
    if (Object.keys(updateData).length > 0) {
      return prisma.user.update({ where: { id }, data: updateData });
    }
    return existing;
  }

  try {
    return await prisma.user.create({
      data: {
        id,
        email: safeEmail,
        userName: safeUsername,
        name: name ?? safeUsername,
        avatarUrl: avatarUrl ?? undefined,
      },
    });
  } catch (e) {
    const code =
      typeof e === "object" && e !== null && "code" in e
        ? (e as { code?: string }).code
        : undefined;
    /** Avoid `instanceof` — duplicate Prisma bundles (Turbopack) can break subclass checks. */
    if (code === "P2002") {
      /** Lost a create race, or DB omits `meta.target` for the violated constraint — re-fetch by Clerk id. */
      const row = await prisma.user.findUnique({ where: { id } });
      if (row) {
        return Object.keys(updateData).length > 0
          ? prisma.user.update({ where: { id }, data: updateData })
          : row;
      }
    }
    throw e;
  }
}
