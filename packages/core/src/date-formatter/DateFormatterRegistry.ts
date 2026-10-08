import { DateFormatterNotFoundError } from "./DateFormatterError";
import type { DateFormatter, RegisterFormatterOptions } from "./types";

/**
 * A named registry of {@link DateFormatter} functions.
 *
 * Consumers register the formatters their application needs once, then resolve
 * them by name wherever a date must be rendered. New formatters can be added
 * without changing existing call sites, which keeps the API extensible.
 *
 * @example
 * ```ts
 * const registry = new DateFormatterRegistry()
 *   .registerDateFormatter("date")
 *   .registerDateTimeFormatter("dateTime");
 *
 * registry.format("date", new Date("2026-01-01T00:00:00Z"));
 * ```
 */
export class DateFormatterRegistry {
  private readonly formatters = new Map<string, DateFormatter>();

  /**
   * Registers a formatter under a name, replacing any existing entry.
   *
   * @param name - The unique name used to resolve the formatter.
   * @param formatter - The function that renders a date.
   * @returns This registry, enabling fluent chaining.
   *
   * @example
   * ```ts
   * registry.register("iso", (date) => date.toISOString());
   * ```
   */
  public register(name: string, formatter: DateFormatter): this {
    this.formatters.set(name, formatter);
    return this;
  }

  /**
   * Registers a long date formatter (e.g. `January 1, 2026`).
   *
   * @param name - The name to register under. Defaults to `"date"`.
   * @param options - Locale and time zone overrides.
   * @returns This registry, enabling fluent chaining.
   *
   * @example
   * ```ts
   * registry.registerDateFormatter("publishedAt", { timeZone: "UTC" });
   * ```
   */
  public registerDateFormatter(name = "date", options: RegisterFormatterOptions = {}): this {
    const { locale = "en-US", timeZone, intlOptions } = options;
    const format = new Intl.DateTimeFormat(locale, {
      timeZone,
      dateStyle: "long",
      ...intlOptions,
    });

    return this.register(name, (date) => format.format(date));
  }

  /**
   * Registers a date and time formatter (e.g. `January 1, 2026 at 1:45 PM`).
   *
   * @param name - The name to register under. Defaults to `"dateTime"`.
   * @param options - Locale and time zone overrides.
   * @returns This registry, enabling fluent chaining.
   *
   * @example
   * ```ts
   * registry.registerDateTimeFormatter("updatedAt");
   * ```
   */
  public registerDateTimeFormatter(
    name = "dateTime",
    options: RegisterFormatterOptions = {},
  ): this {
    const { locale = "en-US", timeZone, intlOptions } = options;
    const format = new Intl.DateTimeFormat(locale, {
      timeZone,
      dateStyle: "long",
      timeStyle: "short",
      ...intlOptions,
    });

    return this.register(name, (date) => format.format(date));
  }

  /**
   * Checks whether a formatter is registered.
   *
   * @param name - The formatter name to look up.
   * @returns `true` when a formatter is registered under the name.
   *
   * @example
   * ```ts
   * registry.has("date"); // true
   * ```
   */
  public has(name: string): boolean {
    return this.formatters.has(name);
  }

  /**
   * Retrieves a registered formatter for reuse.
   *
   * @param name - The formatter name to look up.
   * @returns The formatter, or `undefined` when not registered.
   *
   * @example
   * ```ts
   * const formatter = registry.get("date");
   * formatter?.(new Date());
   * ```
   */
  public get(name: string): DateFormatter | undefined {
    return this.formatters.get(name);
  }

  /**
   * Lists every registered formatter name.
   *
   * @returns The registered names, in insertion order.
   *
   * @example
   * ```ts
   * registry.list(); // ["date", "dateTime"]
   * ```
   */
  public list(): string[] {
    return [...this.formatters.keys()];
  }

  /**
   * Renders a date using the formatter registered under the given name.
   *
   * @param name - The name of the formatter to use.
   * @param date - The date to render.
   * @returns The formatted date string.
   * @throws {DateFormatterNotFoundError} If no formatter is registered under the name.
   *
   * @example
   * ```ts
   * registry.format("date", new Date("2026-01-01T00:00:00Z")); // "January 1, 2026"
   * ```
   */
  public format(name: string, date: Date): string {
    const formatter = this.formatters.get(name);

    if (formatter === undefined) {
      throw new DateFormatterNotFoundError(name, this.list());
    }

    return formatter(date);
  }
}

/**
 * The shared registry instance that applications configure at startup.
 *
 * @example
 * ```ts
 * import { dateFormatter } from "@playernguyen/core";
 *
 * dateFormatter.registerDateFormatter();
 * dateFormatter.registerDateTimeFormatter();
 * ```
 */
export const dateFormatter = new DateFormatterRegistry();
