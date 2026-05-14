import { existsSync, statSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  /** Bust stale PrismaClient in dev after `prisma generate` without restarting the server. */
  prismaDevFingerprint?: string;
};

function prismaClientFingerprint(): string {
  if (process.env.NODE_ENV === "production") return "prod";
  try {
    const root = process.cwd();
    const schemaPath = path.join(root, "prisma/schema.prisma");
    const generatedMarker = path.join(
      root,
      "node_modules/.prisma/client/package.json",
    );
    if (!existsSync(schemaPath) || !existsSync(generatedMarker))
      return "unknown";
    return `${statSync(schemaPath).mtimeMs}:${statSync(generatedMarker).mtimeMs}`;
  } catch {
    return "unknown";
  }
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient;
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
