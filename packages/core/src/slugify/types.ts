/**
 * Configuration for {@link slugify}.
 *
 * Every option has a sensible default so that `slugify(input)` works out of the
 * box, while consumers can tune behaviour as their needs grow.
 *
 * @example
 * ```ts
 * const options: SlugifyOptions = {
 *   separator: "_",
 *   lowercase: false,
 *   strict: false,
 *   maxLength: 40,
 * };
 * ```
 */
export interface SlugifyOptions {
  /**
   * The string used to join words. Defaults to `"-"`.
   */
  readonly separator?: string;

  /**
   * Whether to lowercase the result. Defaults to `true`.
   */
  readonly lowercase?: boolean;

  /**
   * When `true` (default) only ASCII alphanumerics survive; accents are
   * transliterated and every other character is removed. When `false`, any
   * Unicode letter or number is preserved.
   */
  readonly strict?: boolean;

  /**
   * Truncates the slug to at most this many characters, cutting on a word
   * boundary where possible. Unbounded when omitted.
   */
  readonly maxLength?: number;
}
