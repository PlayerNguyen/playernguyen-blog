import path from "node:path";
import { loadEnvConfig } from "@next/env";

/**
 * Bootstraps the Node.js server runtime.
 *
 * Next.js loads `.env` files from the app directory, but this monorepo keeps a
 * single `.env` at the repository root shared by the Prisma CLI and every
 * workspace. Registering the root environment here guarantees the server
 * runtime (including rendering workers) can read `DATABASE_URL` at request time.
 *
 * @example
 * ```ts
 * // Invoked automatically once per server instance by Next.js
 * await register();
 * ```
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  loadEnvConfig(path.resolve(process.cwd(), "../.."));
}
