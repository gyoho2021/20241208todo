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

    if (pathname === '/' && req.method === 'GET') {
        // デフォルトのルートでメッセージを表示
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Welcome to Todo App!</h1><p>Use /todos to manage your tasks.</p>');
    } 
    else if (pathname === '/todos' && req.method === 'GET') {
        const todos = readTodos();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(todos));
    } 
    else if (pathname === '/todos' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const newTask = JSON.parse(body);
            const todos = readTodos();
            todos.push({ id: Date.now(), task: newTask.task });
            saveTodos(todos);
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Task added', todos }));
        });
    } 
    else if (pathname === '/todos' && req.method === 'DELETE') {
        const id = parseInt(query.id, 10);
        let todos = readTodos();
        todos = todos.filter(todo => todo.id !== id);
        saveTodos(todos);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Task deleted', todos }));
    } 
    else {
        // 他のルートにアクセスした場合
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

// サーバーの起動
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
