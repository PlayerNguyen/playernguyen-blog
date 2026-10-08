import { describe, expect, it } from "bun:test";
import { EnvironmentConfiguration } from "./EnvironmentConfiguration";

describe("EnvironmentConfiguration", () => {
  it("should read the node environment and site url from the source", () => {
    const config = new EnvironmentConfiguration({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://blog.example.com",
    });

    expect(config.nodeEnv).toBe("production");
    expect(config.siteUrl.href).toBe("https://blog.example.com/");
    expect(config.isProduction).toBe(true);
  });

  it("should apply development defaults when values are absent", () => {
    const config = new EnvironmentConfiguration({});

    expect(config.nodeEnv).toBe("development");
    expect(config.siteUrl.href).toBe("http://localhost:3000/");
    expect(config.isProduction).toBe(false);
  });
});
