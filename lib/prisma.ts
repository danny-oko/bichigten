import { existsSync, statSync } from "node:fs";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  /** Bust stale PrismaClient in dev after `prisma generate` without restarting the server. */
  prismaDevFingerprint?: string;
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

function prismaClientFingerprint(): string {
  if (process.env.NODE_ENV === "production") return "prod";
  try {
    const root = process.cwd();
    const schemaPath = path.join(root, "prisma/schema.prisma");
    const generatedMarker = path.join(root, "node_modules/.prisma/client/package.json");
    if (!existsSync(schemaPath) || !existsSync(generatedMarker)) return "unknown";
    return `${statSync(schemaPath).mtimeMs}:${statSync(generatedMarker).mtimeMs}`;
  } catch {
    return "unknown";
  }
}

const adapter = new PrismaPg({
  connectionString: accelerateUrlWithExplicitSsl(process.env.DATABASE_URL),
});

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return globalForPrisma.prisma;
  }

  const fp = prismaClientFingerprint();
  const staleDevSingleton =
    globalForPrisma.prisma &&
    (globalForPrisma.prismaDevFingerprint === undefined ||
      globalForPrisma.prismaDevFingerprint !== fp);

  if (staleDevSingleton) {
    void globalForPrisma.prisma?.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter });
    globalForPrisma.prismaDevFingerprint = fp;
  }

  return globalForPrisma.prisma;
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client as object, prop, client);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
}) as PrismaClient;

export default prisma;
