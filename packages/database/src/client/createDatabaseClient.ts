import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { DatabaseConnectionError } from "./DatabaseConnectionError";

/**
 * Creates a Prisma Client connected to PostgreSQL through the pg driver adapter.
 *
 * Prisma ORM v7 requires a driver adapter, so every client is constructed with
 * a {@link PrismaPg} instance bound to the supplied connection string.
 *
 * @param connectionString - A PostgreSQL connection string, e.g.
 * `postgresql://user:pass@localhost:5199/db`.
 * @returns A configured {@link PrismaClient} instance.
 *
 * @example
 * ```ts
 * const database = createDatabaseClient(process.env.DATABASE_URL);
 * const posts = await database.post.findMany();
 * ```
 */
export function createDatabaseClient(connectionString: string): PrismaClient {
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

/**
 * Creates a Prisma Client from a `DATABASE_URL` environment value.
 *
 * @param source - The environment source to read from. Defaults to `process.env`.
 * @returns A configured {@link PrismaClient} instance.
 * @throws {DatabaseConnectionError} If `DATABASE_URL` is missing or empty.
 *
 * @example
 * ```ts
 * const database = createDatabaseClientFromEnv();
 * await database.post.count();
 * ```
 */
export function createDatabaseClientFromEnv(source: NodeJS.ProcessEnv = process.env): PrismaClient {
  const connectionString = source.DATABASE_URL;

  if (connectionString === undefined || connectionString.length === 0) {
    throw new DatabaseConnectionError("The DATABASE_URL environment variable is not set.");
  }

  return createDatabaseClient(connectionString);
}
