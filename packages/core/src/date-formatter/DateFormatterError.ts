/**
 * Raised when a formatter name is requested that has not been registered.
 *
 * @example
 * ```ts
 * throw new DateFormatterNotFoundError("dateTime", ["date"]);
 * // Error: No date formatter registered as "dateTime". Available: date.
 * ```
 */
export class DateFormatterNotFoundError extends Error {
  /**
   * @param name - The unregistered formatter name that was requested.
   * @param available - The names that are currently registered.
   */
  constructor(name: string, available: readonly string[]) {
    const availableMessage =
      available.length > 0
        ? `Available: ${available.join(", ")}.`
        : "No formatters have been registered.";

    super(`No date formatter registered as "${name}". ${availableMessage}`);
    this.name = "DateFormatterNotFoundError";
  }
}
