import { PostService } from "@playernguyen/core";
import { getDatabaseClient, PrismaPostRepository } from "@playernguyen/database";
import { configuredDateFormatter } from "./configureDateFormatter";

/**
 * Builds the application's {@link PostService}, wired to PostgreSQL.
 *
 * The Prisma-backed repository is injected into the domain service here, so the
 * rest of the app depends only on the core abstraction. The database client is
 * resolved lazily on each call through the shared singleton.
 *
 * @returns A {@link PostService} reading and formatting posts from Postgres.
 * @throws {DatabaseConnectionError} If `DATABASE_URL` is missing or empty.
 *
 * @example
 * ```ts
 * import { configurePostService } from "@/configs";
 *
 * const service = configurePostService();
 * const summaries = await service.listSummaries();
 * ```
 */
export function configurePostService(): PostService {
  const repository = new PrismaPostRepository(getDatabaseClient());

  return new PostService(repository, { formatters: configuredDateFormatter });
}
