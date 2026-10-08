import { type DateFormatterRegistry, dateFormatter } from "../date-formatter";
import { slugify } from "../slugify";
import type { Post, PostSummary } from "./types";

/**
 * Data-access boundary for retrieving blog posts.
 *
 * Implementations may read from a database, an API, or an in-memory store,
 * which keeps {@link PostService} independent of any specific persistence layer.
 *
 * @example
 * ```ts
 * const repository: PostRepository = {
 *   findAll: async () => [],
 * };
 * ```
 */
export interface PostRepository {
  /**
   * Loads every available post.
   *
   * @returns A promise resolving to the full list of posts.
   *
   * @example
   * ```ts
   * const posts = await repository.findAll();
   * ```
   */
  findAll(): Promise<Post[]>;
}

/**
 * Optional collaborators for {@link PostService}.
 *
 * @example
 * ```ts
 * const options: PostServiceOptions = {
 *   formatters: dateFormatter,
 *   dateFormatName: "dateTime",
 * };
 * ```
 */
export interface PostServiceOptions {
  /**
   * The registry used to render publication dates. Defaults to the shared
   * {@link dateFormatter} singleton.
   */
  readonly formatters?: DateFormatterRegistry;

  /**
   * The name of the registered formatter used for publication dates. Defaults
   * to `"date"`.
   */
  readonly dateFormatName?: string;
}

/**
 * Application service that exposes read operations over blog posts.
 *
 * @example
 * ```ts
 * const service = new PostService(
 *   {
 *     findAll: async () => [
 *       {
 *         id: "1",
 *         title: "Hello, Bun Workspaces",
 *         content: "...",
 *         publishedAt: new Date("2026-01-01T00:00:00Z"),
 *       },
 *     ],
 *   },
 *   { formatters: dateFormatter },
 * );
 *
 * const summaries = await service.listSummaries();
 * ```
 */
export class PostService {
  private readonly formatters: DateFormatterRegistry;
  private readonly dateFormatName: string;

  /**
   * @param repository - The data source used to load posts.
   * @param options - Optional formatter registry and date format name overrides.
   */
  constructor(
    private readonly repository: PostRepository,
    options: PostServiceOptions = {},
  ) {
    this.formatters = options.formatters ?? dateFormatter;
    this.dateFormatName = options.dateFormatName ?? "date";
  }

  /**
   * Returns presentation-ready summaries for every stored post.
   *
   * @returns A promise resolving to the mapped {@link PostSummary} list.
   * @throws {DateFormatterNotFoundError} If the configured date formatter is not registered.
   *
   * @example
   * ```ts
   * const summaries = await service.listSummaries();
   * // [{ id: "1", title: "Hello, Bun Workspaces", slug: "hello-bun-workspaces", ... }]
   * ```
   */
  public async listSummaries(): Promise<PostSummary[]> {
    const posts = await this.repository.findAll();

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: slugify(post.title),
      publishedAt: this.formatters.format(this.dateFormatName, post.publishedAt),
    }));
  }
}
