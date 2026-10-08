import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { createDatabaseClientFromEnv } from "../src/client/createDatabaseClient";

config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.env"),
  quiet: true,
});

const posts = [
  {
    id: "seed-hello-bun-workspaces",
    title: "Hello, Bun Workspaces",
    content: "How this blog is wired together as a Bun monorepo.",
    publishedAt: new Date("2026-01-01T00:00:00Z"),
  },
  {
    id: "seed-postgres-and-prisma",
    title: "Postgres and Prisma",
    content: "Persisting posts with Prisma 7 and the pg driver adapter.",
    publishedAt: new Date("2026-01-08T00:00:00Z"),
  },
];

const database = createDatabaseClientFromEnv();

try {
  for (const post of posts) {
    await database.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        content: post.content,
        publishedAt: post.publishedAt,
      },
      create: post,
    });
  }

  process.stdout.write(`Seeded ${posts.length} posts.\n`);
} finally {
  await database.$disconnect();
}
