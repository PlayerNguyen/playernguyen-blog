/**
 * Raised when the database client cannot be constructed from its configuration.
 *
 * @example
 * ```ts
 * throw new DatabaseConnectionError("The DATABASE_URL environment variable is not set.");
 * // Error: DatabaseConnectionError: The DATABASE_URL environment variable is not set.
 * ```
 */
export class DatabaseConnectionError extends Error {
  /**
   * @param message - A human-readable explanation of the connection failure.
   */
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}
