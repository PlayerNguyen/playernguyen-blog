import { type Post, PostService } from "@playernguyen/core";
import { configuredDateFormatter, environment } from "@/configs";

const posts: Post[] = [
  {
    id: "1",
    title: "Hello, Bun Workspaces",
    content: "The placeholder blog is up and running.",
    publishedAt: new Date("2026-01-01T00:00:00Z"),
  },
];

/**
 * Renders the blog home page with a list of post summaries.
 *
 * @returns The home page React element.
 *
 * @example
 * ```tsx
 * // Rendered by Next.js for the "/" route
 * <Home />
 * ```
 */
export default async function Home() {
  const service = new PostService(
    { findAll: async () => posts },
    { formatters: configuredDateFormatter },
  );
  const summaries = await service.listSummaries();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="font-bold text-4xl tracking-tight">PlayerNguyen Blog</h1>
        <p className="text-foreground/60 text-sm">Environment: {environment.nodeEnv}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {summaries.map((post) => (
          <li key={post.id} className="rounded-lg border border-foreground/10 p-4">
            <p className="font-medium">{post.title}</p>
            <p className="text-foreground/60 text-sm">{post.publishedAt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
