import { type DateFormatterRegistry, dateFormatter } from "@playernguyen/core";

/**
 * Registers the date and date-time formatters available across the app.
 *
 * Formatters are registered once against the shared `dateFormatter` singleton
 * so any consumer can resolve them by name through `DateFormatterRegistry#format`.
 * Registering them here keeps configuration centralised instead of scattering
 * `Intl.DateTimeFormat` calls across the codebase.
 *
 * @returns The shared registry with the application formatters registered.
 *
 * @example
 * ```ts
 * import { configuredDateFormatter } from "@/configs";
 *
 * configuredDateFormatter.format("date", new Date());
 * configuredDateFormatter.format("dateTime", new Date());
 * ```
 */
export function configureDateFormatter(): DateFormatterRegistry {
  return dateFormatter.registerDateFormatter("date").registerDateTimeFormatter("dateTime");
}

/**
 * The shared date formatter registry, configured once at module load.
 *
 * @example
 * ```ts
 * configuredDateFormatter.list(); // ["date", "dateTime"]
 * ```
 */
export const configuredDateFormatter = configureDateFormatter();
