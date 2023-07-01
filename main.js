

//  -------- 文件重定向 ----------
// 如果是app就不能重定向了,需要注释下面这些代码。
// const fs = require('fs');
// const logFilePath = 'main.log';

// // 重定向 console.log 输出到文件
// const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
// console.log = (...args) => {
//   const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
//   logStream.write(message + '\n');
// };

// -------- 设置mainwindow --------

const { BrowserWindow } = require('electron');
const { app, globalShortcut, ipcMain, clipboard} = require('electron');
let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
      enableRemoteModule: true, // 允许使用 remote 模块
      contextIsolation: false, // 禁用上下文隔离
		}
	});

	// mainWindow.loadURL('https://translate.google.com/');
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}
lastText = "";

// -------- app --------

app.on('ready', () => {
    // 注册全局快捷键
    // globalShortcut.register('CommandOrControl+Shift+C', () => {
    globalShortcut.register('Cmd+E', () => {
      // 在这里执行你的操作或调用你的应用程序的特定方法
      // 获取剪贴板中的选中文本
      const selectedText = clipboard.readText('selection')
      // 在这里执行你的操作或调用你的应用程序的特定方法，将选中文本提供给用户
      // console.log('Selected Text:', selectedText)
      if (mainWindow === null){
        createWindow();
	      mainWindow.loadURL('https://translate.google.com/');
        mainWindow.show();
      } else{
        if (selectedText !== lastText){
          mainWindow.loadURL(`https://translate.google.com/?langpair=auto%7Cauto&text=`+encodeURIComponent(selectedText));
          lastText = selectedText;
        }
        mainWindow.show();
      
    })

    createWindow();
	  mainWindow.loadURL('https://translate.google.com/');
});

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
  if (BrowserWindow.getAllWindows().length === 0 && mainWindow === null) {
    createWindow();
	  mainWindow.loadURL('https://translate.google.com/');
    mainWindow.show();
  }
});


// ---------- http server ---------
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
    lastText = body
    mainWindow.loadURL(`https://translate.google.com/?langpair=auto%7Cauto&text=`+encodeURIComponent(body));
    mainWindow.show();
    // 返回响应给外部请求
    res.end('Received');
  });
});

// 监听服务器端口
server.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});
