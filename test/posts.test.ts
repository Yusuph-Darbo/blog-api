import { describe, it, expect, vi } from "vitest";
import { buildPostQuery, editPostQuery, deletePostQuery } from "./testUtils.js";

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

describe("editPostQuery", () => {
  it("should return 400 for invalid id", async () => {
    const mockQuery = vi.fn();

    const result = await editPostQuery(mockQuery, {
      id: NaN,
      title: "t",
      content: "c",
      author: "a",
      category: "tech",
      tags: ["node"],
    });

    expect(result.status).toBe(400);
  });

  it("should return 404 if the post doesn't exist", async () => {
    const mockQuery = vi.fn().mockResolvedValue({ rows: [] });

    const result = await editPostQuery(mockQuery, {
      id: 1,
      title: "t",
      content: "c",
      author: "a",
      category: "tech",
      tags: ["node"],
    });

    expect(result.status).toBe(404);
  });

  it("should return updated post if successful", async () => {
    const fakePost = { post_id: 1, title: "Updated" };

    const mockQuery = vi.fn().mockResolvedValue({
      rows: [fakePost],
    });

    const result = await editPostQuery(mockQuery, {
      id: 1,
      title: "Updated",
      content: "content",
      author: "me",
      category: "tech",
      tags: ["node"],
    });

    expect(result.status).toBe(200);
  });
});

describe("deletePostQuery", () => {
  it("returns 200 when post is deleted", async () => {
    const mockQuery = vi.fn().mockResolvedValue({
      rows: [{ post_id: 1 }],
    });

    const result = await deletePostQuery(mockQuery, 1);

    expect(result.status).toBe(200);
  });
});
