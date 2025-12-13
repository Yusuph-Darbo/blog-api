import client from './db/databasepg.js'
import express from 'express'

const app = express()
const PORT = 8080

app.get('/posts', async (reg, res) => {
    try {
        const result = await client.query("select * from post")
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Getting post by id
app.get('/posts/:id', async (req, res) => {
    // Get value not object
    const id  = req.params.id

    try{
        const result = await client.query(
            'SELECT * FROM post WHERE post_id = $1',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Post not found"})
        }
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Creating a new post
app.post('/posts', async (req, res) => {
    const {title, content, category_id} = req.body
    try {
        const result = await client.query(
            'INSERT INTO post(title, content, category_id, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW()) RETURNING *',
            [title, content, category_id]
        )
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Editing a post
app.put('posts/:id', async (req,res) => {
    const id  = req.params.id
    const {title, content, category_id} = req.body

    try{

        const result = await client.query(
            `UPDATE post
             SET title = $1,
                 content = $2,
                 category_id = $3,
                 updated_at = NOW()
             WHERE post_id = $4
             RETURNING *`,
            [title, content, category_id, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({error: "Post not found"})
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(
    PORT,
    () => {console.log(`It is live on http://localhost:${PORT}`)}
)