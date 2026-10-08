/**
 * A read-only collection of raw environment values.
 *
 * Kept framework-agnostic so any runtime (Node.js, Bun, edge) can supply its
 * own source, such as `process.env`.
 *
 * @example
 * ```ts
 * const source: EnvironmentSource = { NODE_ENV: "production" };
 * ```
 */
export type EnvironmentSource = Readonly<Record<string, string | undefined>>;

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
