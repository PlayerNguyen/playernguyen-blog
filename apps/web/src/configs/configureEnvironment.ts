import { EnvironmentValidationError } from "./EnvironmentValidationError";
import type { Environment, NodeEnvironment } from "./types";

const NODE_ENVIRONMENTS = ["development", "production", "test"] as const;

/**
 * Parses and validates the raw `NODE_ENV` value.
 *
 * @param value - The raw environment value, possibly `undefined`.
 * @returns The matching {@link NodeEnvironment}, defaulting to `"development"`.
 * @throws {EnvironmentValidationError} If the value is not a supported environment.
 *
 * @example
 * ```ts
 * parseNodeEnvironment("production"); // "production"
 * parseNodeEnvironment(undefined); // "development"
 * ```
 */
function parseNodeEnvironment(value: string | undefined): NodeEnvironment {
  if (value === undefined) {
    return "development";
  }

  if (NODE_ENVIRONMENTS.some((candidate) => candidate === value)) {
    return value as NodeEnvironment;
  }

  throw new EnvironmentValidationError(
    "NODE_ENV",
    `expected one of ${NODE_ENVIRONMENTS.join(", ")}, received "${value}"`,
  );
}

/**
 * Parses and validates the public site URL, falling back to localhost.
 *
 * @param value - The raw `NEXT_PUBLIC_SITE_URL` value, possibly `undefined`.
 * @returns A parsed {@link URL} instance.
 * @throws {EnvironmentValidationError} If a provided value is not a valid URL.
 *
 * @example
 * ```ts
 * parseSiteUrl("https://blog.example.com"); // URL { href: "https://blog.example.com/" }
 * parseSiteUrl(undefined); // URL { href: "http://localhost:3000/" }
 * ```
 */
function parseSiteUrl(value: string | undefined): URL {
  const fallback = "http://localhost:3000";

  try {
    return new URL(value ?? fallback);
  } catch {
    throw new EnvironmentValidationError(
      "NEXT_PUBLIC_SITE_URL",
      `expected a valid URL, received "${value}"`,
    );
  }
}

/**
 * Reads and validates the process environment once at startup.
 *
 * @example
 * ```ts
 * const config = new EnvironmentConfiguration(process.env);
 * config.siteUrl.href; // "http://localhost:3000/"
 * ```
 */
export class EnvironmentConfiguration implements Environment {
  public readonly nodeEnv: NodeEnvironment;
  public readonly siteUrl: URL;

  /**
   * @param source - The environment source to read from. Defaults to `process.env`.
   * @throws {EnvironmentValidationError} If any required variable is invalid.
   */
  constructor(source: NodeJS.ProcessEnv = process.env) {
    this.nodeEnv = parseNodeEnvironment(source.NODE_ENV);
    this.siteUrl = parseSiteUrl(source.NEXT_PUBLIC_SITE_URL);
  }

  /**
   * Indicates whether the application is running in production.
   *
   * @example
   * ```ts
   * if (config.isProduction) {
   *   // production-only behaviour
   * }
   * ```
   */
  public get isProduction(): boolean {
    return this.nodeEnv === "production";
  }
}

/**
 * The singleton environment configuration, parsed once at module load.
 *
 * @example
 * ```ts
 * environment.nodeEnv; // "development"
 * environment.siteUrl.href; // "http://localhost:3000/"
 * ```
 */
export const environment = new EnvironmentConfiguration();
