import { Prisma } from "@prisma/client";

/**
 * Prisma Accelerate rejects interactive transaction `timeout: 15000` (P6005).
 * Keep options at or below these caps — see pris.ly/configure-limits.
 */
export const ACCELERATE_INTERACTIVE_TX_OPTIONS = {
  isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
  maxWait: 2_000,
  timeout: 10_000,
} as const;
