const Redis = require('ioredis');
const express = require('express');
const app = express();
const router = express.Router();

const redis = new Redis({
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD, // Redisのパスワードを設定
    enableOfflineQueue: false, // Redisがオフラインのときにキューイングを無効化
});

// ログ出力ミドルウェア
const logMiddleware = (req, res, next) => {
    console.log(Date.now(), req.method, req.url);
    next();
};

app.use(logMiddleware);

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.get('/err', (req, res) => {
    throw new Error('This is a test error');
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.status(200).send(`User ID: ${userId}`);
});

redis.once('ready', () => {
    try {
        app.listen(3000, () => {
            console.log('Start listening');
    });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
    process.exit(1);
});

//包括的エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});