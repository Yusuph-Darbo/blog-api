import client from './db/databasepg.js'
import express from 'express'

const app = express()
const PORT = 8080

app.length('/posts', async (reg, res) => {
    try {
        const result = await client.query("select * from post")
        res.json(result.rows)
    } catch (err) {
        console.error(err)
    }
})

app.listen(
    PORT,
    () => {console.log(`It is live on https://localhost:${PORT}`)}
)

// const res = await client.query('select * from post')
// console.log(res.rows)