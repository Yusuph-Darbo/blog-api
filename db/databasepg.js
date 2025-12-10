import pkg from 'pg'

const {Client} = pkg

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "rootUser",
    database: "yusuphdarbo"
})

await client.connect()
const res = await client.query('select * from post');
console.log(res.rows);
await client.end();