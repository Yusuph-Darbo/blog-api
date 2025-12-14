import client from './db/databasepg.js'
import express from 'express'

const app = express()
app.use(express.json());

app.get('/posts', async (req, res) => {
    const {category, tags} = req.query

    let query = 'SELECT * FROM post'
    // Used to prevent SQL injection
    const values = []
    const conditions = []

    // Checking if a query param was passed
    if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
    }

    if (tags) {
        // tags can be comma-separated
        const tagArray = tags.split(',')
        values.push(tagArray)
        // '&&' operator checks if arrays overlap
        conditions.push(`tags && $${values.length}::text[]`)
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ')
    }

    try {
        const result = await client.query(query, values)
        res.status(200).json(result.rows)

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
        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Creating a new post
app.post('/posts', async (req, res) => {
    const {title, content, author, category, tags} = req.body

    if (!title || !content || !author || !category || !Array.isArray(tags)) {
        return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    try {
        const result = await client.query(
            'INSERT INTO post(title, content, author, category, tags) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [title, content, author, category, tags]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Editing a post
app.put('/posts/:id', async (req,res) => {
    const id  = req.params.id
    const {title, content, author, category, tags} = req.body

    try{

        const result = await client.query(
            `UPDATE post
             SET title = $1,
                 content = $2,
                 author = $3,
                 category = $4,
                 tags = $5,
                 updated_at = NOW()
             WHERE post_id = $6
             RETURNING *`,
            [title, content, author, category, tags, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({error: "Post not found"})
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete('/posts/:id', async (req,res) => {
    const id  = req.params.id

    try {
        const result = await client.query(
            'DELETE FROM post WHERE post_id = $1 RETURNING *',
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' })
        }

        res.json({ message: `Post ${id} deleted successfully` })
        
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(8080, () => {console.log('It is live on http://localhost:8080')})