import { defineConfig, env } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // Prisma 7 uses this field for migrations.
    // Ensure this environment variable is your DIRECT connection.
    url: env("DIRECT_URL"),
  },
});
