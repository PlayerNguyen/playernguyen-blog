import { SlugifyError } from "./SlugifyError";
import type { SlugifyOptions } from "./types";

const DIACRITICS = /[\u0300-\u036f]/g;

const TRANSLITERATIONS: Record<string, string> = {
  đ: "d",
  Đ: "D",
  ø: "o",
  Ø: "O",
  æ: "ae",
  Æ: "AE",
  œ: "oe",
  Œ: "OE",
  ß: "ss",
  ł: "l",
  Ł: "L",
};

const TRANSLITERATION_PATTERN = /[đĐøØæÆœŒßłŁ]/g;

/**
 * Converts an arbitrary string into a URL-safe slug.
 *
 * The transformation normalises Unicode, transliterates accents and common
 * special Latin letters, drops icons/emoji and other symbols, and joins the
 * remaining words with the configured separator. Behaviour is tuned through
 * {@link SlugifyOptions}, which is designed to grow without breaking callers.
 *
 * @param input - The raw string to slugify.
 * @param options - Optional slug configuration. See {@link SlugifyOptions}.
 * @returns A URL-safe slug, free of leading/trailing separators.
 * @throws {SlugifyError} If the separator option is empty.
 *
 * @example
 * ```ts
 * slugify("Hello, Next.js!"); // "hello-next-js"
 * slugify("Café ☕ Đà Nẵng 🚀"); // "cafe-da-nang"
 * slugify("Custom Separator", { separator: "_" }); // "custom_separator"
 * slugify("Hello 🌍 World", { strict: false }); // "hello-world"
 * ```
 */
export function slugify(input: string, options: SlugifyOptions = {}): string {
  const { separator = "-", lowercase = true, strict = true, maxLength } = options;

  if (separator.length === 0) {
    throw new SlugifyError("The separator option must not be empty.");
  }

  let value = input.normalize("NFKD").replace(DIACRITICS, "");
  value = value.replace(TRANSLITERATION_PATTERN, (char) => TRANSLITERATIONS[char] ?? char);

  if (lowercase) {
    value = value.toLowerCase();
  }

  const disallowed = strict ? /[^a-zA-Z0-9]+/g : /[^\p{L}\p{N}]+/gu;
  value = value.replace(disallowed, separator);

  value = trimSeparators(value, separator);

  if (maxLength !== undefined && maxLength > 0 && value.length > maxLength) {
    value = value.slice(0, maxLength);
    const lastSeparator = value.lastIndexOf(separator);
    if (lastSeparator > 0) {
      value = value.slice(0, lastSeparator);
    }
    value = trimSeparators(value, separator);
  }

  return value;
}

/**
 * Removes any leading and trailing occurrences of the separator.
 *
 * @param value - The value to trim.
 * @param separator - The non-empty separator to strip.
 * @returns The trimmed value.
 *
 * @example
 * ```ts
 * trimSeparators("-hello-world-", "-"); // "hello-world"
 * ```
 */
function trimSeparators(value: string, separator: string): string {
  let result = value;

  while (result.startsWith(separator)) {
    result = result.slice(separator.length);
  }

  while (result.endsWith(separator)) {
    result = result.slice(0, separator.length * -1);
  }

  return result;
}
