// Loads .env from the project root when run via `bunx prisma` / Prisma CLI (Bun also injects env for .env files).
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
