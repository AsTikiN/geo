// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const net = require("net");

let mainWindow;
let serverProcess;
let serverPort = 3000;

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
  mainWindow.loadURL(`http://localhost:${serverPort}`);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Функция для проверки доступности порта
function waitForServer(port, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function checkPort() {
      const socket = new net.Socket();

      socket.setTimeout(1000);

      socket.on("connect", () => {
        socket.destroy();
        resolve(port);
      });

      socket.on("timeout", () => {
        socket.destroy();
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error(`Server not ready after ${maxAttempts} attempts`));
        } else {
          setTimeout(checkPort, 1000);
        }
      });

      socket.on("error", () => {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error(`Server not ready after ${maxAttempts} attempts`));
        } else {
          setTimeout(checkPort, 1000);
        }
      });

      socket.connect(port, "localhost");
    }

    checkPort();
  });
}

function startServer() {
  // Запускаем Next.js сервер как дочерний процесс
  const isWindows = process.platform === "win32";

  serverProcess = spawn("node", ["server.js"], {
    cwd: path.resolve(__dirname),
    shell: true,
    stdio: "inherit",
    env: {
      ...process.env,
      // Добавляем node_modules/.bin в PATH для Windows
      PATH:
        process.env.PATH +
        (isWindows ? ";" : ":") +
        path.join(__dirname, "node_modules", ".bin"),
    },
  });

  serverProcess.on("exit", (code) => {
    console.log(`Next.js сервер остановлен с кодом ${code}`);
  });
}

// Функция для корректного завершения всех процессов
function cleanup() {
  if (serverProcess) {
    console.log("Останавливаем сервер...");
    serverProcess.kill("SIGTERM");

    // Если процесс не завершился через 3 секунды, принудительно убиваем
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill("SIGKILL");
      }
    }, 3000);
  }
}

app.whenReady().then(async () => {
  startServer();

  try {
    // Ждем, пока сервер будет готов и получим порт
    console.log("Ожидание готовности сервера...");
    serverPort = await waitForServer(3000);
    console.log(`Сервер готов на порту ${serverPort}, создаем окно...`);
    createWindow();
  } catch (error) {
    console.error("Ошибка ожидания сервера:", error.message);
    // Пробуем другие порты
    for (let port = 3001; port <= 3010; port++) {
      try {
        serverPort = await waitForServer(port);
        console.log(`Сервер найден на порту ${serverPort}`);
        createWindow();
        return;
      } catch (e) {
        continue;
      }
    }
    console.error("Не удалось найти работающий сервер");
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  cleanup();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Обработка сигналов завершения
process.on("SIGINT", () => {
  cleanup();
  app.quit();
});

process.on("SIGTERM", () => {
  cleanup();
  app.quit();
});

// Обработка необработанных исключений
process.on("uncaughtException", (error) => {
  console.error("Необработанное исключение:", error);
  cleanup();
  app.quit();
});
