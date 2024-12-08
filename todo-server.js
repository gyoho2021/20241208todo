const http = require('http');
const url = require('url');
const fs = require('fs');

const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

const todoFile = 'todos.json';

// タスクデータを読み込む関数
function readTodos() {
    if (fs.existsSync(todoFile)) {
        return JSON.parse(fs.readFileSync(todoFile, 'utf8'));
    }
    return [];
}

// タスクデータを保存する関数
function saveTodos(todos) {
    fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
}

// サーバーの作成
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // デフォルトのルート
    if (pathname === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Todo App</title>
            </head>
            <body>
                <h1>Welcome to Todo App!</h1>
                <p>Use the buttons below to manage your tasks:</p>
                <button onclick="location.href='/todos/view'">View Tasks</button>
                <button onclick="location.href='/todos/add'">Add New Task</button>
            </body>
            </html>
        `);
    }
    // タスク一覧を表示
    else if (pathname === '/todos/view' && req.method === 'GET') {
        const todos = readTodos();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>View Tasks</title>
            </head>
            <body>
                <h1>Your Tasks</h1>
                <ul>
                    ${todos.map(todo => `<li>${todo.task} (ID: ${todo.id})</li>`).join('')}
                </ul>
                <button onclick="location.href='/'">Go Back</button>
            </body>
            </html>
        `);
    }
    // タスク追加画面
    else if (pathname === '/todos/add' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Add Task</title>
            </head>
            <body>
                <h1>Add a New Task</h1>
                <form action="/todos" method="POST">
                    <input type="text" name="task" placeholder="Enter your task" required>
                    <button type="submit">Add Task</button>
                </form>
                <button onclick="location.href='/'">Go Back</button>
            </body>
            </html>
        `);
    }
    // 新しいタスクを追加
    else if (pathname === '/todos' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const newTask = new URLSearchParams(body).get('task');
            const todos = readTodos();
            todos.push({ id: Date.now(), task: newTask });
            saveTodos(todos);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Task Added</title>
                </head>
                <body>
                    <h1>Task Added Successfully</h1>
                    <button onclick="location.href='/todos/view'">View Tasks</button>
                    <button onclick="location.href='/todos/add'">Add Another Task</button>
                    <button onclick="location.href='/'">Go Back</button>
                </body>
                </html>
            `);
        });
    }
    // タスクを削除
    else if (pathname === '/todos' && req.method === 'DELETE') {
        const id = parseInt(query.id, 10);
        let todos = readTodos();
        todos = todos.filter(todo => todo.id !== id);
        saveTodos(todos);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Task deleted', todos }));
    }
    // その他のリクエスト
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

// サーバーの起動
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
