import { connection } from "next/server";
import { Suspense } from "react";
import { configurePostService, environment } from "@/configs";

/**
 * Renders the list of post summaries from Postgres.
 *
 * Reads at request time so newly persisted posts appear without a rebuild.
 *
 * @returns The post list React element.
 *
 * @example
 * ```tsx
 * <Suspense fallback={<p>Loading posts...</p>}>
 *   <PostList />
 * </Suspense>
 * ```
 */
async function PostList() {
  await connection();

  const service = configurePostService();
  const summaries = await service.listSummaries();

  return (
    <ul className="flex flex-col gap-3">
      {summaries.map((post) => (
        <li key={post.id} className="rounded-lg border border-foreground/10 p-4">
          <p className="font-medium">{post.title}</p>
          <p className="text-foreground/60 text-sm">{post.publishedAt}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Renders the blog home page with the list of post summaries from Postgres.
 *
 * The static shell renders immediately while {@link PostList} streams in.
 *
 * @returns The home page React element.
 *
 * @example
 * ```tsx
 * // Rendered by Next.js for the "/" route
 * <Home />
 * ```
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="font-bold text-4xl tracking-tight">PlayerNguyen Blog</h1>
        <p className="text-foreground/60 text-sm">Environment: {environment.nodeEnv}</p>
      </div>
      <Suspense fallback={<p className="text-foreground/60 text-sm">Loading posts...</p>}>
        <PostList />
      </Suspense>
    </main>
  );
}
