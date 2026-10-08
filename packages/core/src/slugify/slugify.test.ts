import { describe, expect, it } from "bun:test";
import { SlugifyError } from "./SlugifyError";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("should convert a title into a url-safe slug", () => {
    expect(slugify("Hello, Next.js!")).toBe("hello-next-js");
  });

  it("should transliterate accented latin letters", () => {
    expect(slugify("Café crème")).toBe("cafe-creme");
  });

  it("should transliterate special latin letters", () => {
    expect(slugify("Đặng Thùy")).toBe("dang-thuy");
    expect(slugify("Straße")).toBe("strasse");
    expect(slugify("Ærøskøbing")).toBe("aeroskobing");
  });

  it("should remove icons and emoji from the slug", () => {
    expect(slugify("I ❤️ JavaScript")).toBe("i-javascript");
    expect(slugify("Rocket 🚀 launch")).toBe("rocket-launch");
  });

  it("should convert special characters and symbols into separators", () => {
    expect(slugify("Price: $100 © 2026")).toBe("price-100-2026");
    expect(slugify("Tom & Jerry")).toBe("tom-jerry");
  });

  it("should strip control and non-printable ascii characters", () => {
    expect(slugify("\u0000Hello\u0007World\u001b")).toBe("hello-world");
  });

  it("should collapse consecutive special characters into a single separator", () => {
    expect(slugify("foo---bar___baz")).toBe("foo-bar-baz");
    expect(slugify("a     b\t\tc")).toBe("a-b-c");
  });

  it("should trim leading and trailing separators", () => {
    expect(slugify("  --Leading and trailing--  ")).toBe("leading-and-trailing");
  });

  it("should return an empty string when nothing url-safe remains", () => {
    expect(slugify("日本語")).toBe("");
    expect(slugify("🌍🚀✨")).toBe("");
  });

  it("should support a custom separator", () => {
    expect(slugify("Custom Separator", { separator: "_" })).toBe("custom_separator");
  });

  it("should preserve unicode letters when strict mode is disabled", () => {
    expect(slugify("café 日本語", { strict: false })).toBe("cafe-日本語");
  });

  it("should preserve case when lowercasing is disabled", () => {
    expect(slugify("Hello World", { lowercase: false })).toBe("Hello-World");
  });

  it("should truncate to maxLength without leaving a trailing separator", () => {
    expect(slugify("hello wonderful world", { maxLength: 11 })).toBe("hello");
    expect(slugify("hello world", { maxLength: 5 })).toBe("hello");
  });

  it("should leave an already valid slug untouched", () => {
    expect(slugify("already-a-slug")).toBe("already-a-slug");
  });

  it("should throw when the separator option is empty", () => {
    expect(() => slugify("Hello", { separator: "" })).toThrow(SlugifyError);
  });
});
