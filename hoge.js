// const iso = require('isomorphitc-fetch');

console.log(process.env.FOO)

await dbRun(
    `CREATE TABLE IF NOT EXISTS todo(
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL)
    `
)

