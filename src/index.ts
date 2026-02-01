import app from "./server.js";
import client from "./db/database.js";
import type { Request, Response } from "express";
import type { QueryResult } from "pg";
import type { posts, postUpdated } from "./types/posts.js";

app.get("/posts", async (req: Request, res: Response): Promise<void> => {
  const { category, tags } = req.query;

  let query: string = "SELECT * FROM post";

  /*
  SQL query parameters.
  Each element in the array represents one bound parameter.
  A parameter can be:
    - a string (e.g., "tech")
    - an array of strings (e.g., ["react", "typescript"] for Postgres array queries)
  Example:
    [
      "tech",
      ["react", "typescript"],
      "backend"
    ]
  Used to prevent SQL injection.
*/
  const values: (string | string[])[] = [];
  const conditions: string[] = [];

  // Checking if a query param was passed
  if (typeof category === "string") {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  if (typeof tags === "string") {
    // tags can be comma-separated
    const tagArray = tags.split(",");
    values.push(tagArray);
    // '&&' operator checks if arrays overlap
    conditions.push(`tags && $${values.length}::text[]`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  try {
    const result = await client.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

//Getting post by id
app.get("/posts/:id", async (req: Request, res: Response): Promise<void> => {
  // Getting id from req
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid post id" });
    return;
  }

  try {
    const result: QueryResult<posts> = await client.query(
      "SELECT * FROM post where post_id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

// Editing a post
app.put(
  "/posts/:id",
  async (
    req: Request<{ id: string }, any, postUpdated>,
    res: Response,
  ): Promise<void> => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid post id" });
      return;
    }
    const { title, content, author, category, tags } = req.body;

    try {
      const result = await client.query<posts>(
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
        res.status(400).json({ error: "Post not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  },
);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
