// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Открываем в окне URL локального сервера Next.js
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startServer() {
  // Запускаем Next.js сервер как дочерний процесс
  serverProcess = spawn("node", ["server.js"], {
    cwd: path.resolve(__dirname),
    shell: true,
    stdio: "inherit",
  });

  serverProcess.on("exit", (code) => {
    console.log(`Next.js сервер остановлен с кодом ${code}`);
  });
}

app.whenReady().then(() => {
  startServer();

  // Немного подождать, чтобы сервер поднялся (можно добавить проверку порта)
  setTimeout(() => {
    createWindow();
  }, 5000); // 5 секунд — адаптируйте при необходимости

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
