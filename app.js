'use strict'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const dataStorage = require(`./${process.env.npm_lifecycle_event}`);

const router = express.Router();
const cookieParser = require('cookie-parser');

// Logging middleware
const logMiddleware = (req, res, next) => {
    console.log(Date.now(), req.method, req.url);
    next();
};
const app = express();

app.use(logMiddleware);
app.use(express.json()); // JSONリクエストのパース
app.use(express.urlencoded({ extended: true })); // URLエンコードされたリクエストのパース
app.use(cookieParser());



app.get('/', (req, res) => {
    res.status(200).send('Hora el Mundo!');
});

app.get('/err', (req, res) => {
    throw new Error('This is a test error');
    console.log("err route here");
    res.status(200).send('error route')
});


// Get list of Todos
app.get('/api/todos', (req, res, next) => {
    if (!req.query.completed) {
        // if completed query parameter is not provided, return all todos
        return dataStorage.fetchAll().then(todos => res.json(todos), next); 
    }
    const completed = req.query.completed === 'true';
    dataStorage.fetchByCompleted(completed).then(todos => res.json(todos), next);
});

// Create a new TODO
app.post('/api/todos', (req, res, next) => {
    const { title } = req.body;
    if (typeof title !== 'string' || !title) {
        const err = new Error('title is required');
        err.statusCode = 400;
        return next(err);
    }
    const todo = { id: uuidv4() /* Generate UUID */, title, completed: false };
    dataStorage.create(todo).then(() => res.status(201).json(todo), next);
});

// common process for setting and unsetting Completed status
function completedHandler(completed) {
    return (req, res, next) => 
        dataStorage.update(req.params.id, { completed })
            .then( todo => {
                if (todo) {
                    return res.json(todo);
            }
            const err = new Error('Todo not found');
            err.statusCode = 404;
            next(err);
            }, next);
}

// Completed setting and unsetting for a TODO
app.route('/api/todos/:id/completed')
    .put(completedHandler(true))
    .delete(completedHandler(false));

// delete a TODO
app.delete('/api/todos/:id', (req, res, next) => {
    console.log("Received ID is: " + req.params.id);
    dataStorage.remove(req.params.id).then(id => {
        if (id !== null) {
            return res.status(204).end()
        }
        const err = new Error('Todo not found');
        err.statusCode = 404;
        next(err);
    }, next)
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.log("checkpoint here.")
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;