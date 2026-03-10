import type {
  UpdatePostInput,
  UpdatePostResult,
  DeletePostResult,
} from "../src/types/test.js";

// Functional logic of creating a post without quering db so I can unittest it
export function buildPostQuery(category?: string, tags?: string) {
  const values: (string | string[])[] = [];
  const conditions: string[] = [];
  let query = "SELECT * FROM post";

  if (typeof category === "string") {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  if (typeof tags === "string") {
    const tagArray = tags.split(",");
    values.push(tagArray);
    conditions.push(`tags && $${values.length}::text[]`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  return { query, values };
}

// Functional logic of editing a post
export async function editPostQuery(
  dbQuery: Function,
  input: UpdatePostInput,
): Promise<UpdatePostResult> {
  const { id, title, content, author, category, tags } = input;

  if (Number.isNaN(id)) {
    return { status: 400, error: "Invalid post id" };
  }

  const result = await dbQuery(
    `UPDATE post
             SET title = $1,
                 content = $2,
                 author = $3,
                 category = $4,
                 tags = $5,
                 updated_at = NOW()
             WHERE post_id = $6
             RETURNING *`,
    [title, content, author, category, tags, id],
  );

  if (result.rows.length === 0) {
    return { status: 404, error: "Post not found" };
  }

  return { status: 200, data: result.rows[0] };
}

// Functional logic of deleting a post
export async function deletePostQuery(
  dbQuery: Function,
  id: number,
): Promise<DeletePostResult> {
  if (Number.isNaN(id)) {
    return { status: 400, error: "Invalid post id" };
  }

  try {
    const result = await dbQuery(
      "DELETE FROM post WHERE post_id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return { status: 404, error: "Post not found" };
    }

    return { status: 200, data: `Post ${id} deleted successfully` };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, error: err.message };
    }

    return { status: 500, error: "Unknown error occurred" };
  }
}
