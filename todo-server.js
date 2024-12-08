const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const filePath = 'tasks.json';

// タスクデータを読み込む関数
const loadTasks = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// タスクデータを保存する関数
const saveTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// サーバー作成
const server = http.createServer((req, res) => {
    const tasks = loadTasks();

    if (req.method === 'GET' && req.url === '/') {
        // タスク一覧とフォームを表示
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Todo List</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px; }
                    h1 { color: #333; }
                    ul { list-style-type: none; padding: 0; }
                    li { margin: 5px 0; padding: 10px; background: #fff; border: 1px solid #ccc; border-radius: 5px; display: flex; justify-content: space-between; }
                    form { margin-top: 20px; }
                    input, button { padding: 10px; margin: 5px; }
                </style>
            </head>
            <body>
                <h1>Todo List</h1>
                <ul>
                    ${tasks.map(task => `<li>${task.name} <a href="/delete?id=${task.id}">Delete</a></li>`).join('')}
                </ul>
                <form method="POST" action="/add">
                    <input type="text" name="task" placeholder="New task" required>
                    <button type="submit">Add Task</button>
                </form>
            </body>
            </html>
        `);
    } else if (req.method === 'POST' && req.url === '/add') {
        // タスクを追加
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const taskName = params.get('task');
            if (taskName) {
                tasks.push({ id: tasks.length + 1, name: taskName });
                saveTasks(tasks);
            }
            res.writeHead(302, { Location: '/' }); // リダイレクト
            res.end();
        });
    } else if (req.method === 'GET' && req.url.startsWith('/delete')) {
        // タスクを削除
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const idToDelete = parseInt(urlParams.searchParams.get('id'), 10);
        const updatedTasks = tasks.filter(task => task.id !== idToDelete);

        // 再番号付け
        updatedTasks.forEach((task, index) => {
            task.id = index + 1;
        });

        saveTasks(updatedTasks);
        res.writeHead(302, { Location: '/' }); // リダイレクト
        res.end();
    } else {
        res.statusCode = 404;
        res.end('404 Not Found');
    }
});

// サーバーを起動
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
