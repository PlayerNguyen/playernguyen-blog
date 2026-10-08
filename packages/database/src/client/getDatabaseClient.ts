import type { PrismaClient } from "../../generated/prisma/client";
import { createDatabaseClientFromEnv } from "./createDatabaseClient";

const globalForDatabase = globalThis as typeof globalThis & {
  __playernguyenDatabase?: PrismaClient;
};

/**
 * Returns a process-wide singleton {@link PrismaClient}.
 *
 * The instance is cached on `globalThis` so that hot reloads and repeated
 * module evaluations during development reuse a single connection pool instead
 * of leaking a new client per reload. Inject the returned client into
 * repositories rather than importing it deep inside domain logic.
 *
 * @param source - The environment source to read `DATABASE_URL` from. Defaults
 * to `process.env`.
 * @returns The shared {@link PrismaClient} instance.
 * @throws {DatabaseConnectionError} If `DATABASE_URL` is missing or empty.
 *
 * @example
 * ```ts
 * const database = getDatabaseClient();
 * await database.post.count();
 * ```
 */
export function getDatabaseClient(source: NodeJS.ProcessEnv = process.env): PrismaClient {
  globalForDatabase.__playernguyenDatabase ??= createDatabaseClientFromEnv(source);

  return globalForDatabase.__playernguyenDatabase;
}
