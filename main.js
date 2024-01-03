const fs = require('fs');
//  -------- 文件重定向 ----------
// 如果是封装好的mac app就不能重定向了,需要注释下面这些代码。
// 本地开发调试时打开, 然后tail -f main.log就可以看log了
// const logFilePath = 'main.log';

// // 重定向 console.log 输出到文件
// const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
// console.log = (...args) => {
//   const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
//   logStream.write(message + '\n');
// };

// -------- 设置mainwindow --------

const { BrowserWindow } = require("electron");
const { app, globalShortcut, ipcMain, clipboard, session} = require("electron");
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true, // 允许使用 remote 模块
            contextIsolation: false, // 禁用上下文隔离
        },
    });

    // mainWindow.loadURL('https://translate.google.com/');
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}
lastText = "";
// proxy
const path = require('path');
const yaml = require('js-yaml');

function readConfig(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const config = yaml.load(fileContent);
    return config;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 文件不存在，创建一个空文件并返回空对象
      fs.writeFileSync(filePath, '');
      return {};
    }
    throw error; // 抛出其他文件读取错误
  }
}

function makeRequest(url, config) {
  if (config.use_proxy) {
    // 使用代理配置
    const proxies = config.proxies || {};
    // 使用适当的 HTTP 请求库发送请求
    // 这里假设您使用的是 'requests' 库
    const response = requests.get(url, { proxies });
    return response.text;
  } else {
    // 不使用代理
    const response = requests.get(url);
    return response.text;
  }
}

function getProxyConfig() {
  const homeDir = require('os').homedir();
  // 构建配置文件路径
  const configFile = path.join(homeDir, '.google_translation_config.yml');
  // 读取配置文件
  const config = readConfig(configFile);
  return config;
}

// -------- app --------

app.on("ready", () => {
    // 注册全局快捷键
    // globalShortcut.register('CommandOrControl+Shift+C', () => {
    globalShortcut.register("Cmd+E", () => {
        // 在这里执行你的操作或调用你的应用程序的特定方法
        // 获取剪贴板中的选中文本
        const selectedText = clipboard.readText("selection");
        // 在这里执行你的操作或调用你的应用程序的特定方法，将选中文本提供给用户
        // console.log('Selected Text:', selectedText)
        if (mainWindow === null) {
            createWindow();
            mainWindow.loadURL("https://translate.google.com/");
        } else {
            if (selectedText !== lastText) {
                mainWindow.loadURL(
                    `https://translate.google.com/?langpair=auto%7Cauto&text=` +
                        encodeURIComponent(selectedText)
                );
                lastText = selectedText;
            }
        }
        mainWindow.show();
    });
    const proxy = getProxyConfig()
    if (proxy && proxy.use_proxy && proxy.proxy) {
      // 设置会话的代理
      console.log("启用proxy: " + proxy.proxy);
      session.defaultSession.allowNTLMCredentialsForDomains('*');
      session.defaultSession.setProxy({ proxyRules: proxy.proxy, pacScript: '' });
    }
    createWindow();
    mainWindow.loadURL("https://translate.google.com/");
});

app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("will-quit", () => {
    // 注销所有的全局快捷键
    globalShortcut.unregisterAll();
});

app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0 && mainWindow === null) {
        createWindow();
        mainWindow.loadURL("https://translate.google.com/");
        mainWindow.show();
    }
});

// ---------- http server ---------
const http = require("http");

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    let body = "";

    // 监听请求数据事件，拼接数据
    req.on("data", (chunk) => {
        body += chunk;
    });

    // 监听请求结束事件，处理数据
    req.on("end", () => {
        console.log("收到的数据: ", body);
        if (mainWindow === null) {
            createWindow();
        }
        // 将数据传输给渲染进程
        lastText = body;
        mainWindow.loadURL(
            `https://translate.google.com/?langpair=auto%7Cauto&text=` +
                encodeURIComponent(body)
        );
        mainWindow.show();
        // 返回响应给外部请求
        res.end("Received");
    });
});

// 监听服务器端口
server.listen(3000, () => {
    console.log("HTTP server listening on port 3000");
});
