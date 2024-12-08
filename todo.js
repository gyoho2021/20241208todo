const fs = require('fs'); // ファイル操作モジュール
const filePath = 'tasks.json'; // タスクを保存するファイルパス

// コマンドライン引数を取得
const [,, command, ...args] = process.argv;

// タスクデータを読み込む関数
const loadTasks = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data); // JSONデータをオブジェクトに変換
    } catch (err) {
        return []; // ファイルがない場合、空のリストを返す
    }
};

// タスクデータを保存する関数
const saveTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// コマンド処理
switch (command) {
    case 'add': { // タスクの追加
        const taskName = args.join(' '); // 引数を1つの文字列として結合
        if (!taskName) {
            console.log('Error: Please provide a task name.');
            break;
        }
        const tasks = loadTasks();
        tasks.push({ id: tasks.length + 1, name: taskName });
        saveTasks(tasks);
        console.log(`Task added: "${taskName}"`);
        break;
    }
    case 'list': { // タスクの一覧表示
        const tasks = loadTasks();
        if (tasks.length === 0) {
            console.log('No tasks found.');
        } else {
            console.log('Your tasks:');
            tasks.forEach(task => {
                console.log(`[${task.id}] ${task.name}`);
            });
        }
        break;
    }
    case 'remove': { // タスクの削除
        const taskId = parseInt(args[0], 10); // 引数を数字として取得
        if (isNaN(taskId)) {
            console.log('Error: Please provide a valid task ID.');
            break;
        }
        const tasks = loadTasks();
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        if (tasks.length === updatedTasks.length) {
            console.log(`Error: Task with ID ${taskId} not found.`);
        } else {
            // 再番号付け
            updatedTasks.forEach((task, index) => {
                task.id = index + 1;
            });
            saveTasks(updatedTasks);
            console.log(`Task removed: ID ${taskId}`);
        }
        break;
    }
    default: { // 不明なコマンド
        console.log('Usage:');
        console.log('  todo add "Task name"   - Add a new task');
        console.log('  todo list             - List all tasks');
        console.log('  todo remove <Task ID> - Remove a task by its ID');
        break;
    }
}
