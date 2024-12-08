const http = require('http');
const url = require('url');
const fs = require('fs');

const port = process.env.PORT || 3000; // RenderでPORT環境変数を使用
const hostname = '0.0.0.0'; // Renderが要求する0.0.0.0を使用

// タスクデータを保存するファイル
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

    // タスクの一覧を取得
    if (pathname === '/todos' && req.method === 'GET') {
        const todos = readTodos();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(todos));
    }
    // 新しいタスクを追加
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