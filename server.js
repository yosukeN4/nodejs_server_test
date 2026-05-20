const express = require('express');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');

// ログ出力ミドルウェア
const logMiddleware = (req, res, next) => {
    console.log(Date.now(), req.method, req.url);
    next();
};

let todos = [
    { id: 1, title: 'name', completed: false },
    { id: 2, title: 'draft', completed: true },
    { id: 3, title: 'test', completed: false },
    { id: 4, title: 'deploy', completed: true }
];

app.use(logMiddleware);
app.use(express.json()); // JSONリクエストのパース
app.use(express.urlencoded({ extended: true })); // URLエンコードされたリクエストのパース
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.get('/err', (req, res) => {
    throw new Error('This is a test error');
    console.log("err route here");
    res.status(200).send('error route')
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.status(200).send(`User ID: ${userId}`);
});

// list TODOs
app.get('/api/todos', (req, res) => {
    if (!req.query.completed) {
        return res.json(todos)  // if completed query parameter is not provided, return all todos
    }

    // completed query parameter is provided, filter todos by completed status
    const completed = req.query.completed === 'true';
    res.json(todos.filter(todo => todo.completed === completed));
});


// post new TODO
app.post('/api/todos', (req, res, next) => {
    // console.log(req.body);
    // console.log(req.body.title);
    // console.log(typeof req.body);
    // console.log(typeof req.body.title);

    const {title} = req.body;

    if (typeof title !== 'string' || !title) {
        const err = new Error('Title is required and must be a string');
        err.statusCode = 400;
        return next(err);
    }
    // create new TODO
    const newTodo = { id: todos.length + 1, title, completed: false };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Middleware for getting TODO by ID
app.use('/api/todos/:id', (req, res, next) => {
    const targetId = Number(req.params.id);
    const todo = todos.find(todo => todo.id === targetId);
    if (!todo) {
        const err = new Error('TODO not found');
        err.statusCode = 404;
        return next(err);
    }
    req.todo = todo;
    next();
});

// Setting and unsetting for TODO completed param
app.route('/api/todos/:id/completed')
    .put((req, res) => {
        req.todo.completed = true;
        res.json(req.todo);
    })
    .delete((req, res) => {
        req.todo.completed = false;
        res.json(req.todo);
    });

// Delete a TODO
app.delete('/api/todos/:id', (req, res) => {
    todos = todos.filter(todo => todo.id !== req.todo.id);
    res.status(204).end();
});

//包括的エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});