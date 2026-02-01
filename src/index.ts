import app from "./server.js";
import client from "./db/database.js";

app.get("/posts", async (req, res) => {
  const { category, tags } = req.query;

  let query: string = "SELECT * FROM post";

  // Used to prevent SQL injection
  /*
    Values can be a string or an array of string
    inside an array where each value can be a string or an array of strings
    e.g. "tech", ["tech", "news"]
    OR 
    [
        "tech",
        ["react", "typescript"],
        "backend"
    ]
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
    query += "WHERE " + conditions.join(" AND ");
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

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
