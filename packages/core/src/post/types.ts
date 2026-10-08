/**
 * A blog post as stored by the domain layer.
 *
 * @example
 * ```ts
 * const post: Post = {
 *   id: "1",
 *   title: "Hello, Bun Workspaces",
 *   content: "The placeholder blog is up and running.",
 *   publishedAt: new Date("2026-01-01T00:00:00Z"),
 * };
 * ```
 */
export interface Post {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly publishedAt: Date;
}

/**
 * A presentation-ready projection of a {@link Post}, carrying a derived slug and
 * a human-readable publication date.
 *
 * @example
 * ```ts
 * const summary: PostSummary = {
 *   id: "1",
 *   title: "Hello, Bun Workspaces",
 *   slug: "hello-bun-workspaces",
 *   publishedAt: "January 1, 2026",
 * };
 * ```
 */
export interface PostSummary {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly publishedAt: string;
}
