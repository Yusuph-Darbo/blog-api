import { describe, it, expect } from "vitest";
import { buildPostQuery } from "./testUtils.js";

describe("buildPostQuery", () => {
  it("should build query without filters", () => {
    const result = buildPostQuery();
    expect(result.query).toBe("SELECT * FROM post");
    expect(result.values).toEqual([]);
  });

  it("should build query with category only", () => {
    const result = buildPostQuery("tech");
    expect(result.query).toBe("SELECT * FROM post WHERE category = $1");
    expect(result.values).toEqual(["tech"]);
  });

  it("should build query with tags only", () => {
    const result = buildPostQuery(undefined, "react,typescript");
    expect(result.query).toBe("SELECT * FROM post WHERE tags && $1::text[]");
    expect(result.values).toEqual([["react", "typescript"]]);
  });

  it("should build query with both category and tags", () => {
    const result = buildPostQuery("tech", "react,typescript");
    expect(result.query).toBe(
      "SELECT * FROM post WHERE category = $1 AND tags && $2::text[]",
    );
    expect(result.values).toEqual(["tech", ["react", "typescript"]]);
  });
});
