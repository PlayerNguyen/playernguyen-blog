import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const packageDirectory = path.dirname(fileURLToPath(import.meta.url));

config({
  path: [path.resolve(packageDirectory, "../../.env"), path.resolve(packageDirectory, ".env")],
  quiet: true,
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
