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
