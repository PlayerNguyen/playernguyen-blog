import { describe, expect, it } from "bun:test";
import type { PrismaClient } from "../client";
import { PrismaPostRepository } from "./PrismaPostRepository";

const publishedAt = new Date("2026-01-01T00:00:00Z");

const database = {
  post: {
    findMany: async () => [
      {
        id: "1",
        title: "Hello, Bun Workspaces",
        content: "The placeholder blog is up and running.",
        publishedAt,
        createdAt: publishedAt,
        updatedAt: publishedAt,
      },
    ],
  },
} as unknown as PrismaClient;

describe("PrismaPostRepository", () => {
  it("should map database rows into domain posts", async () => {
    const repository = new PrismaPostRepository(database);

    const posts = await repository.findAll();

    expect(posts).toEqual([
      {
        id: "1",
        title: "Hello, Bun Workspaces",
        content: "The placeholder blog is up and running.",
        publishedAt,
      },
    ]);
  });

  it("should order posts by publication date descending", async () => {
    let receivedOrderBy: unknown;
    const spy = {
      post: {
        findMany: async (args: { orderBy: unknown }) => {
          receivedOrderBy = args.orderBy;
          return [];
        },
      },
    } as unknown as PrismaClient;

    await new PrismaPostRepository(spy).findAll();

    expect(receivedOrderBy).toEqual({ publishedAt: "desc" });
  });
});
