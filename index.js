import client from './db/databasepg.js'
import express from 'express'

const app = express()
const PORT = 8080

app.get('/posts', async (reg, res) => {
    try {
        const result = await client.query("select * from post")
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Getting post by id
app.get('/posts/:id', async (reg, res) => {
    try{
        const result = await client.query("SELECT * FROM post WHERE post_id = $1")
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Post not found"})
        }
        res.json(result.rows[0])
    } catch {
        res.status(500).json({ error: err.message });
    }
})

app.listen(
    PORT,
    () => {console.log(`It is live on http://localhost:${PORT}`)}
)