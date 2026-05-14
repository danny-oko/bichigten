import { Prisma } from "@prisma/client";

/** True for dropped TCP / pooler idle-close errors that often succeed on retry. */
export function isTransientDbError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P1017") return true;
  }
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("Server has closed the connection") ||
    msg.includes("Connection terminated unexpectedly") ||
    msg.includes("ECONNRESET") ||
    msg.includes("EPIPE")
  );
}

export async function withDbRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!isTransientDbError(e) || i === attempts - 1) {
        throw e;
      }
      await new Promise((r) => setTimeout(r, 80 * (i + 1)));
    }
  }
  throw last;
}
