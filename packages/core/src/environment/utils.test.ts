import { describe, expect, it } from "bun:test";
import { EnvironmentValidationError } from "./EnvironmentValidationError";
import { parseNodeEnvironment, parseUrl } from "./utils";

describe("parseNodeEnvironment", () => {
  it("should default to development when the value is unset", () => {
    expect(parseNodeEnvironment(undefined)).toBe("development");
  });

  it("should default to development when the value is empty", () => {
    expect(parseNodeEnvironment("")).toBe("development");
  });

  it("should accept supported environments", () => {
    expect(parseNodeEnvironment("production")).toBe("production");
    expect(parseNodeEnvironment("test")).toBe("test");
  });

  it("should throw for unsupported environments", () => {
    expect(() => parseNodeEnvironment("staging")).toThrow(EnvironmentValidationError);
  });
});

describe("parseUrl", () => {
  it("should parse a valid url", () => {
    expect(parseUrl("https://blog.example.com").href).toBe("https://blog.example.com/");
  });

  it("should fall back when the value is unset", () => {
    expect(parseUrl(undefined).href).toBe("http://localhost:3000/");
  });

  it("should use a custom fallback when provided", () => {
    expect(parseUrl(undefined, "SITE_URL", "https://fallback.example.com").href).toBe(
      "https://fallback.example.com/",
    );
  });

  it("should throw for an invalid url", () => {
    expect(() => parseUrl("not a url")).toThrow(EnvironmentValidationError);
  });
});
