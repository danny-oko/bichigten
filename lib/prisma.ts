import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

/**
 * `pg-connection-string` emits a deprecation warning when `sslmode` resolves to
 * `prefer` | `require` | `verify-ca`. Always set `verify-full` explicitly on the
 * Accelerate URL so `pg` parses a single unambiguous mode (see warning text).
 */
function accelerateUrlWithExplicitSsl(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    url.searchParams.set("sslmode", "verify-full");
    return url.toString();
  } catch {
    return raw;
  }
}

const adapter = new PrismaPg({
  connectionString: accelerateUrlWithExplicitSsl(process.env.DATABASE_URL),
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
