import client from './db/databasepg.js'

const res = await client.query('select * from post')
console.log(res.rows)