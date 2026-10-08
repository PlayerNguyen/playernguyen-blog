import { describe, expect, it } from "bun:test";
import { createDatabaseClient, createDatabaseClientFromEnv } from "./createDatabaseClient";
import { DatabaseConnectionError } from "./DatabaseConnectionError";

describe("createDatabaseClient", () => {
  it("should build a Prisma client exposing the post delegate", () => {
    const database = createDatabaseClient("postgresql://postgres:postgres@localhost:5199/test");

    expect(typeof database.post.findMany).toBe("function");
  });
});

describe("createDatabaseClientFromEnv", () => {
  it("should build a Prisma client from a DATABASE_URL value", () => {
    const database = createDatabaseClientFromEnv({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5199/test",
    });

    expect(typeof database.post.findMany).toBe("function");
  });

  it("should throw when DATABASE_URL is missing", () => {
    expect(() => createDatabaseClientFromEnv({})).toThrow(DatabaseConnectionError);
  });

  it("should throw when DATABASE_URL is empty", () => {
    expect(() => createDatabaseClientFromEnv({ DATABASE_URL: "" })).toThrow(
      DatabaseConnectionError,
    );
  });
});
