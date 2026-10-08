import { describe, expect, it } from "bun:test";
import { DateFormatterNotFoundError } from "./DateFormatterError";
import { DateFormatterRegistry } from "./DateFormatterRegistry";

const DATE = new Date("2026-01-01T13:45:00Z");

describe("DateFormatterRegistry", () => {
  it("should format dates using a registered date formatter", () => {
    const registry = new DateFormatterRegistry().registerDateFormatter("date", {
      timeZone: "UTC",
    });

    expect(registry.format("date", DATE)).toContain("January 1, 2026");
  });

  it("should format date and time using a registered date-time formatter", () => {
    const registry = new DateFormatterRegistry().registerDateTimeFormatter("dateTime", {
      timeZone: "UTC",
    });

    const formatted = registry.format("dateTime", DATE);
    expect(formatted).toContain("2026");
    expect(formatted).toContain("1:45");
  });

  it("should honour locale and time zone overrides", () => {
    const registry = new DateFormatterRegistry().registerDateFormatter("date", {
      locale: "en-GB",
      timeZone: "Europe/London",
    });

    expect(registry.format("date", DATE)).toContain("1 January 2026");
  });

  it("should list registered formatter names in insertion order", () => {
    const registry = new DateFormatterRegistry()
      .registerDateFormatter()
      .registerDateTimeFormatter();

    expect(registry.list()).toEqual(["date", "dateTime"]);
  });

  it("should expose a registered formatter for reuse", () => {
    const registry = new DateFormatterRegistry().registerDateFormatter("date");
    const formatter = registry.get("date");

    expect(formatter?.(DATE)).toBeString();
  });

  it("should report whether a formatter is registered", () => {
    const registry = new DateFormatterRegistry().registerDateFormatter("date");

    expect(registry.has("date")).toBe(true);
    expect(registry.has("dateTime")).toBe(false);
  });

  it("should throw when formatting with an unknown name", () => {
    const registry = new DateFormatterRegistry().registerDateFormatter("date");

    expect(() => registry.format("dateTime", DATE)).toThrow(DateFormatterNotFoundError);
  });

  it("should support custom formatter functions", () => {
    const registry = new DateFormatterRegistry().register("iso", (date) => date.toISOString());

    expect(registry.format("iso", DATE)).toBe("2026-01-01T13:45:00.000Z");
  });
});
