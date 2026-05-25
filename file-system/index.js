'use strict'
const {extname} = require('path');
const {readdir, readFile, writeFile, unlink} = require('fs').promises;

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

exports.update = async (id, updates) => {
    const fileName = `${__dirname}/${id}.json`;
    return readFile(fileName, 'utf8').then(
        content => {
            const todo = {
                ...JSON.parse(content),
                ...updates
            };
            return writeFile(fileName, JSON.stringify(todo)).then(() => todo);
        },
        // If the file doesn't exist, return null, otherwise propagate the error
        err => err.code === 'ENOENT' ? null : Promise.reject(err)
    );
};

exports.delete = (id) => {
    unlink(`${__dirname}/${id}.json}`)
    .then(
        () => id,
        // if the file doesn't exist, return null, otherwise propagate the error
        err => err.code === 'ENOENT' ? null : Promise.reject(err)
    )
}
