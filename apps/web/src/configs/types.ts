/**
 * The runtime environments recognised by the application.
 *
 * @example
 * ```ts
 * const env: NodeEnvironment = "production";
 * ```
 */
export type NodeEnvironment = "development" | "production" | "test";

/**
 * The validated, application-facing environment configuration.
 *
 * @example
 * ```ts
 * const env: Environment = {
 *   nodeEnv: "development",
 *   siteUrl: new URL("http://localhost:3000"),
 * };
 * ```
 */
export interface Environment {
  readonly nodeEnv: NodeEnvironment;
  readonly siteUrl: URL;
}
