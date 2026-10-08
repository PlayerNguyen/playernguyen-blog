import { describe, expect, it } from "bun:test";
import { DateFormatterRegistry } from "../date-formatter";
import { PostService } from "./PostService";
import type { Post } from "./types";

const post: Post = {
  id: "1",
  title: "Hello, Bun Workspaces!",
  content: "The placeholder blog is up and running.",
  publishedAt: new Date("2026-01-01T00:00:00Z"),
};

describe("PostService", () => {
  it("should summarize posts using injected slugify and date formatting", async () => {
    const formatters = new DateFormatterRegistry().registerDateFormatter("date", {
      timeZone: "UTC",
    });
    const service = new PostService({ findAll: async () => [post] }, { formatters });

    const [summary] = await service.listSummaries();

    expect(summary).toEqual({
      id: "1",
      title: "Hello, Bun Workspaces!",
      slug: "hello-bun-workspaces",
      publishedAt: "January 1, 2026",
    });
  });

  it("should throw when the required date formatter is not registered", async () => {
    const service = new PostService(
      { findAll: async () => [post] },
      { formatters: new DateFormatterRegistry() },
    );

    await expect(service.listSummaries()).rejects.toThrow();
  });
});
