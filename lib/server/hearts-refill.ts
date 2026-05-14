import prisma from "@/lib/prisma";
import { invalidateAfterUserRowMutation } from "@/lib/server/invalidate-data-cache";

/** Matches lesson UI and header cap. */
export const MAX_USER_HEARTS = 5;

const REFILL_AFTER_MS = 60 * 60 * 1000;

type HeartRefillRow = {
  heartsRemaining: number;
  heartsDepletedAt: Date | null;
};

/**
 * When hearts hit 0, `heartsDepletedAt` records when the timer starts.
 * After {@link REFILL_AFTER_MS}, the next read restores full hearts.
 * Users at 0 with no timestamp (pre-migration) are treated as eligible for refill.
 *
 * Uses `$queryRaw` / `$executeRaw` so this module does not depend on `UserSelect`
 * matching the DB (avoids TS/runtime drift when `prisma generate` is stale).
 */
export async function ensureHeartsRefilledIfDue(userId: string): Promise<void> {
  const rows = await prisma.$queryRaw<HeartRefillRow[]>`
    SELECT "heartsRemaining", "heartsDepletedAt"
    FROM "users_table"
    WHERE id = ${userId}
    LIMIT 1
  `;
  const user = rows[0];
  if (!user || user.heartsRemaining !== 0) return;

  const depletedAt = user.heartsDepletedAt;
  const due =
    !depletedAt || Date.now() - depletedAt.getTime() >= REFILL_AFTER_MS;

  if (!due) return;

  await prisma.$executeRaw`
    UPDATE "users_table"
    SET "heartsRemaining" = ${MAX_USER_HEARTS}, "heartsDepletedAt" = NULL
    WHERE id = ${userId}
      AND "heartsRemaining" = 0
  `;

  invalidateAfterUserRowMutation(userId);
}
