import type { Environment, EnvironmentSource, NodeEnvironment } from "./types";
import { parseNodeEnvironment, parseUrl } from "./utils";

/**
 * Reads and validates an environment source into a typed configuration.
 *
 * @example
 * ```ts
 * const config = new EnvironmentConfiguration(process.env);
 * config.nodeEnv; // "development"
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
  constructor(source: EnvironmentSource = process.env) {
    this.nodeEnv = parseNodeEnvironment(source.NODE_ENV);
    this.siteUrl = parseUrl(source.NEXT_PUBLIC_SITE_URL);
  }

  /**
   * Indicates whether the configuration targets the production environment.
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
