import { existsSync, statSync } from "node:fs";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import { ACCELERATE_INTERACTIVE_TX_OPTIONS } from "@/lib/server/prisma-transaction";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  /** Bust stale PrismaClient in dev after `prisma generate` without restarting the server. */
  prismaDevFingerprint?: string;
};

function isAccelerateDatabaseUrl(url: string | undefined): url is string {
  if (!url) return false;
  return url.startsWith("prisma://") || url.startsWith("prisma+postgres://");
}

/**
 * `pg-connection-string` emits a deprecation warning when `sslmode` resolves to
 * `prefer` | `require` | `verify-ca`. Set `verify-full` explicitly so `pg` parses a single mode.
 */
function connectionStringWithExplicitSsl(raw: string | undefined): string | undefined {
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
    const generatedMarker = path.join(
      root,
      "node_modules/.prisma/client/package.json",
    );
    const prismaModulePath = path.join(root, "lib/prisma.ts");
    if (!existsSync(schemaPath) || !existsSync(generatedMarker))
      return "unknown";
    const prismaModuleMtime = existsSync(prismaModulePath)
      ? statSync(prismaModulePath).mtimeMs
      : 0;
    // Include prisma module mtime so HMR busts the singleton when client wiring changes.
    return `${prismaModuleMtime}:${statSync(schemaPath).mtimeMs}:${statSync(generatedMarker).mtimeMs}`;
  } catch {
    return "unknown";
  }
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (isAccelerateDatabaseUrl(databaseUrl)) {
    return new PrismaClient({
      accelerateUrl: connectionStringWithExplicitSsl(databaseUrl),
      transactionOptions: {
        maxWait: ACCELERATE_INTERACTIVE_TX_OPTIONS.maxWait,
        timeout: ACCELERATE_INTERACTIVE_TX_OPTIONS.timeout,
      },
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  }

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  const adapter = new PrismaPg({
    connectionString: connectionStringWithExplicitSsl(databaseUrl),
  });
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
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
    globalForPrisma.prisma = createPrismaClient();
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
