import { describe, it, expect } from "vitest";
import { buildPostQuery } from "./testUtils.js";

describe("buildPostQuery", () => {
  it("should build query without filters", () => {
    const result = buildPostQuery();
    expect(result.query).toBe("SELECT * FROM post");
    expect(result.values).toEqual([]);
  });
});
