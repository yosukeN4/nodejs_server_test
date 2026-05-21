'use strict'
const {extname} = require('path');
const {readdir, readFile, writeFile} = require('fs').promises;

exports.fetchAll = async () => {
    // Read all json-files in the same data directory
    const files = (await readdir(__dirname))
                .filter(file => extname(file) === '.json')
    return Promise.all(
        files.map(file => 
            readFile(`${__dirname}/${file}`, 'utf-8').then(JSON.parse)
        )
    )};

exports.fetchByCompleted = (completed) => exports.fetchAll()
    .then(all => all.filter(todo => todo.completed === completed));

exports.create = (todo) => 
    writeFile(`${__dirname}/${todo.id}.json`, JSON.stringify(todo));

// Implement update and delete functions as needed