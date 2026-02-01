import app from "./server.js";
import client from "./db/database.js";

app.get("/posts", async (req, res) => {
  const { category, tags } = req.query;

  let query: string = "SELECT * FROM post";

  // Used to prevent SQL injection
  const values: string[] = [];
  const conditions: string[] = [];

  // Checking if a query param was passed
  if (typeof category === "string") {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
