/**
 * Raised when {@link slugify} receives an invalid configuration.
 *
 * @example
 * ```ts
 * throw new SlugifyError("The separator option must not be empty.");
 * // Error: SlugifyError: The separator option must not be empty.
 * ```
 */
export class SlugifyError extends Error {
  /**
   * @param message - A human-readable explanation of the invalid configuration.
   */
  constructor(message: string) {
    super(message);
    this.name = "SlugifyError";
  }
}
