/**
 * Renders a date into a display string.
 *
 * @example
 * ```ts
 * const iso: DateFormatter = (date) => date.toISOString();
 * ```
 */
export type DateFormatter = (date: Date) => string;

/**
 * Options passed to the built-in date formatter registrations.
 *
 * @example
 * ```ts
 * const options: RegisterFormatterOptions = {
 *   locale: "en-GB",
 *   timeZone: "Europe/London",
 * };
 * ```
 */
export interface RegisterFormatterOptions {
  /**
   * A BCP 47 locale tag. Defaults to `"en-US"`.
   */
  readonly locale?: string;

  /**
   * An IANA time zone, e.g. `"Asia/Ho_Chi_Minh"`. Defaults to the runtime zone.
   */
  readonly timeZone?: string;

  /**
   * Overrides forwarded to `Intl.DateTimeFormat`. When supplied, individual
   * fields take precedence over the built-in styles.
   */
  readonly intlOptions?: Intl.DateTimeFormatOptions;
}
