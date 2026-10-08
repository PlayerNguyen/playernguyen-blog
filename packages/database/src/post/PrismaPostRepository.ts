import type { Post, PostRepository } from "@playernguyen/core";
import type { PrismaClient } from "../client";

/**
 * PostgreSQL-backed implementation of the core {@link PostRepository} contract.
 *
 * The Prisma client is injected through the constructor so the repository stays
 * decoupled from how the connection is configured and can be swapped or mocked
 * in tests.
 *
 * @example
 * ```ts
 * import { getDatabaseClient, PrismaPostRepository } from "@playernguyen/database";
 *
 * const repository = new PrismaPostRepository(getDatabaseClient());
 * const posts = await repository.findAll();
 * ```
 */
export class PrismaPostRepository implements PostRepository {
  /**
   * @param database - The Prisma client used to read posts.
   */
  constructor(private readonly database: PrismaClient) {}

  /**
   * Loads every post, most recently published first.
   *
   * @returns A promise resolving to the domain {@link Post} list.
   *
   * @example
   * ```ts
   * const posts = await repository.findAll();
   * // [{ id: "...", title: "Hello", content: "...", publishedAt: Date }]
   * ```
   */
  public async findAll(): Promise<Post[]> {
    const posts = await this.database.post.findMany({
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      publishedAt: post.publishedAt,
    }));
  }
}
