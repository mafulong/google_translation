
const fs = require('fs');
const logFilePath = 'main.log';

// 重定向 console.log 输出到文件
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
console.log = (...args) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
  logStream.write(message + '\n');
};
console.log("哈哈哈哈");


const { BrowserWindow } = require('electron');
const { app, globalShortcut, ipcMain } = require('electron');
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 800,
		webPreferences: {
			nodeIntegration: true
		}
	});

	mainWindow.loadURL('https://translate.google.com/');
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('will-quit', () => {
  // 注销所有的全局快捷键
  globalShortcut.unregisterAll();
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0 && mainWindow === null) createWindow();
});
// app.on('activate', function () {

// 	if (mainWindow === null) {
// 		createWindow();
// 	}
// });

const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  let body = '';

  // 监听请求数据事件，拼接数据
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 监听请求结束事件，处理数据
  req.on('end', () => {
    console.log("收到的数据: ", body)
    if (mainWindow === null){
      createWindow();
    }
    // 将数据传输给渲染进程
    mainWindow.loadURL(`https://translate.google.com/?langpair=auto%7Cauto&text=`+encodeURIComponent(body));
    // mainWindow.setAlwaysOnTop(true, 'floating', 1);
    mainWindow.focus();
    // mainWindow.setAlwaysOnTop(true);
    // 返回响应给外部请求
    res.end('Received');
  });
});

// 监听服务器端口
server.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});
