const http = require('http');

// サーバーの設定
const hostname = '127.0.0.1';
const port = 3000;

// サーバーの作成
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // フォームを表示する
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Stylish Form</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background: white;
                        padding: 20px 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    h1 {
                        margin-bottom: 20px;
                        color: #444;
                    }
                    label {
                        display: block;
                        margin: 10px 0 5px;
                        font-weight: bold;
                    }
                    input, textarea, button {
                        width: 100%;
                        padding: 10px;
                        margin: 10px 0;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    button {
                        background-color: #5cb85c;
                        color: white;
                        border: none;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    button:hover {
                        background-color: #4cae4c;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Submit Your Data</h1>
                    <form method="POST" action="/">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required>
                        <label for="message">Message:</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </body>
            </html>
        `);
    } else if (req.method === 'POST') {
        // フォームから送信されたデータを受け取る
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = body.split('&').reduce((acc, pair) => {
                const [key, value] = pair.split('=');
                acc[decodeURIComponent(key)] = decodeURIComponent(value);
                return acc;
            }, {});

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Submission Received</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #eef2f3;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        .container {
                            background: white;
                            padding: 20px 30px;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        h1 {
                            margin-bottom: 20px;
                            color: #333;
                        }
                        p {
                            margin: 10px 0;
                        }
                        ul {
                            list-style: none;
                            padding: 0;
                        }
                        li {
                            margin: 5px 0;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Thank You for Your Submission!</h1>
                        <p>Here is the data you submitted:</p>
                        <ul>
                            <li><strong>Name:</strong> ${data.name}</li>
                            <li><strong>Message:</strong> ${data.message}</li>
                        </ul>
                    </div>
                </body>
                </html>
            `);
        });
    } else {
        // その他のリクエストは404を返す
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
    }
});

// サーバーの起動
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
