/**
 * Raised when an environment variable is missing or malformed.
 *
 * @example
 * ```ts
 * throw new EnvironmentValidationError("NODE_ENV", "expected a valid value");
 * // Error: Invalid environment variable "NODE_ENV": expected a valid value
 * ```
 */
export class EnvironmentValidationError extends Error {
  /**
   * @param variable - The name of the offending environment variable.
   * @param reason - A human-readable explanation of why validation failed.
   */
  constructor(variable: string, reason: string) {
    super(`Invalid environment variable "${variable}": ${reason}`);
    this.name = "EnvironmentValidationError";
  }
}
