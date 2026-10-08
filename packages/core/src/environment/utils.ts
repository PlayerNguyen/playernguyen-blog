import { EnvironmentValidationError } from "./EnvironmentValidationError";
import type { NodeEnvironment } from "./types";

const NODE_ENVIRONMENTS = ["development", "production", "test"] as const;

/**
 * Parses and validates a raw `NODE_ENV` value.
 *
 * @param value - The raw environment value, possibly `undefined` or empty.
 * @param variableName - The variable name reported in validation errors.
 * @returns The matching {@link NodeEnvironment}, defaulting to `"development"`.
 * @throws {EnvironmentValidationError} If the value is not a supported environment.
 *
 * @example
 * ```ts
 * parseNodeEnvironment("production"); // "production"
 * parseNodeEnvironment(undefined); // "development"
 * ```
 */
export function parseNodeEnvironment(
  value: string | undefined,
  variableName = "NODE_ENV",
): NodeEnvironment {
  if (value === undefined || value.length === 0) {
    return "development";
  }

  if (NODE_ENVIRONMENTS.some((candidate) => candidate === value)) {
    return value as NodeEnvironment;
  }

  throw new EnvironmentValidationError(
    variableName,
    `expected one of ${NODE_ENVIRONMENTS.join(", ")}, received "${value}"`,
  );
}

/**
 * Parses and validates a URL environment value, falling back when absent.
 *
 * @param value - The raw environment value, possibly `undefined` or empty.
 * @param variableName - The variable name reported in validation errors.
 * @param fallback - The URL used when the value is absent.
 * @returns A parsed {@link URL} instance.
 * @throws {EnvironmentValidationError} If the provided value is not a valid URL.
 *
 * @example
 * ```ts
 * parseUrl("https://blog.example.com").href; // "https://blog.example.com/"
 * parseUrl(undefined).href; // "http://localhost:3000/"
 * ```
 */
export function parseUrl(
  value: string | undefined,
  variableName = "NEXT_PUBLIC_SITE_URL",
  fallback = "http://localhost:3000",
): URL {
  const candidate = value === undefined || value.length === 0 ? fallback : value;

  try {
    return new URL(candidate);
  } catch {
    throw new EnvironmentValidationError(variableName, `expected a valid URL, received "${value}"`);
  }
}
