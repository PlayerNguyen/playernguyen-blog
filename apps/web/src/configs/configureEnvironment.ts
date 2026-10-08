import { EnvironmentConfiguration } from "@playernguyen/core";

/**
 * The singleton environment configuration for the web app, parsed once at
 * module load.
 *
 * Parsing and validation live in `@playernguyen/core`; the app owns the
 * instance lifecycle so that importing the core package stays free of side
 * effects.
 *
 * @example
 * ```ts
 * environment.nodeEnv; // "development"
 * environment.siteUrl.href; // "http://localhost:3000/"
 * ```
 */
export const environment = new EnvironmentConfiguration();
