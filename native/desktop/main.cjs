"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  net,
  Notification,
  powerMonitor,
  shell,
  Tray
} = require("electron");
const { autoUpdater } = require("electron-updater");

const UPDATE_CONFIG_URL = "https://charisna-money.netlify.app/desktop-updates/windows/provider.json";
const MAX_REMINDERS = 250;
let mainWindow = null;
let tray = null;
let isQuitting = false;
let reminderTimer = null;
let updateTimer = null;
let pendingReminders = [];
let flushBeforeQuitStarted = false;
let flushBeforeQuitDone = false;
let activeUpdateUrl = null;
let updaterEventsBound = false;

function userFile(name) {
  return path.join(app.getPath("userData"), name);
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf8");
  } catch (error) {
    console.warn("Desktop state could not be saved:", error);
  }
}

function windowState() {
  return readJson(userFile("window-state.json"), {
    width: 1220,
    height: 790
  });
}

function saveWindowState() {
  if (!mainWindow || mainWindow.isDestroyed() || mainWindow.isMinimized()) return;
  writeJson(userFile("window-state.json"), mainWindow.getBounds());
}

function createWindow() {
  const saved = windowState();
  mainWindow = new BrowserWindow({
    width: Math.max(900, Number(saved.width) || 1220),
    height: Math.max(650, Number(saved.height) || 790),
    x: Number.isFinite(saved.x) ? saved.x : undefined,
    y: Number.isFinite(saved.y) ? saved.y : undefined,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: "#101019",
    show: false,
    autoHideMenuBar: true,
    title: "CHARISNA Money Management",
    icon: path.join(__dirname, "build", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: false,
      devTools: !app.isPackaged
    }
  });

  mainWindow.loadFile(path.join(__dirname, "app", "index.html"));
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file:")) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.once("ready-to-show", () => {
    if (!process.argv.includes("--background")) mainWindow.show();
  });
  mainWindow.on("resize", saveWindowState);
  mainWindow.on("move", saveWindowState);
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      mainWindow.webContents.executeJavaScript(
        "typeof lockApplication === 'function' && lockApplication('Aplikasi dikunci saat masuk tray.')"
      ).catch(() => {});
    }
  });
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) createWindow();
  mainWindow.show();
  mainWindow.restore();
  mainWindow.focus();
}

function createTray() {
  tray = new Tray(path.join(__dirname, "build", "icon.png"));
  tray.setToolTip("CHARISNA Money Management · autosave aktif");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Buka CHARISNA", click: showMainWindow },
    {
      label: "Kunci Aplikasi",
      click: () => mainWindow?.webContents.executeJavaScript(
        "typeof lockApplication === 'function' && lockApplication('Aplikasi dikunci dari tray.')"
      ).catch(() => {})
    },
    { label: "Periksa Pembaruan", click: checkForUpdates },
    { type: "separator" },
    {
      label: "Keluar Sepenuhnya",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]));
  tray.on("double-click", showMainWindow);
}

function sanitizeReminder(item) {
  const at = Number(item?.at);
  const id = String(item?.id || "").slice(0, 180);
  if (!id || !Number.isFinite(at)) return null;
  return {
    id,
    at,
    title: String(item.title || "Pengingat CHARISNA").slice(0, 120),
    body: String(item.body || "Ada aktivitas keuangan yang perlu diperiksa.").slice(0, 300)
  };
}

function saveReminders() {
  writeJson(userFile("reminders.json"), pendingReminders);
}

function checkDueReminders() {
  const now = Date.now();
  const due = pendingReminders.filter((item) => item.at <= now + 15000 && item.at >= now - 86400000);
  if (!due.length) return;

  due.slice(0, 8).forEach((item) => {
    if (!Notification.isSupported()) return;
    const notification = new Notification({
      title: item.title,
      body: item.body,
      icon: path.join(__dirname, "build", "icon.png"),
      silent: false
    });
    notification.on("click", showMainWindow);
    notification.show();
  });

  const fired = new Set(due.map((item) => item.id));
  pendingReminders = pendingReminders.filter((item) => !fired.has(item.id));
  saveReminders();
}

function startReminderService() {
  pendingReminders = readJson(userFile("reminders.json"), [])
    .map(sanitizeReminder)
    .filter(Boolean)
    .slice(0, MAX_REMINDERS);
  clearInterval(reminderTimer);
  reminderTimer = setInterval(checkDueReminders, 30000);
  checkDueReminders();
  powerMonitor.on("resume", checkDueReminders);
}

function sendUpdateStatus(status) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("updates:status", status);
  }
}

async function resolveUpdateUrl() {
  try {
    const response = await net.fetch(`${UPDATE_CONFIG_URL}?t=${Date.now()}`, {
      cache: "no-store"
    });
    if (!response.ok) return null;
    const config = await response.json();
    const url = String(config?.url || "").replace(/\/+$/, "");
    return config?.enabled === true && /^https:\/\//i.test(url) ? url : null;
  } catch (error) {
    console.warn("Update channel config unavailable:", error.message);
    return null;
  }
}

function bindUpdaterEvents() {
  if (updaterEventsBound) return;
  updaterEventsBound = true;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on("checking-for-update", () => sendUpdateStatus({ state: "checking" }));
  autoUpdater.on("update-available", (info) => sendUpdateStatus({ state: "available", version: info.version }));
  autoUpdater.on("update-not-available", (info) => sendUpdateStatus({ state: "current", version: info.version }));
  autoUpdater.on("download-progress", (progress) => sendUpdateStatus({ state: "downloading", percent: Math.round(progress.percent || 0) }));
  autoUpdater.on("update-downloaded", (info) => {
    sendUpdateStatus({ state: "downloaded", version: info.version });
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: "Pembaruan CHARISNA siap",
        body: `Versi ${info.version} sudah diunduh dan akan dipasang saat aplikasi ditutup.`,
        icon: path.join(__dirname, "build", "icon.png")
      });
      notification.on("click", showMainWindow);
      notification.show();
    }
  });
  autoUpdater.on("error", (error) => sendUpdateStatus({ state: "error", message: error.message }));
}

function configureUpdater() {
  if (!app.isPackaged) return;
  bindUpdaterEvents();
  setTimeout(checkForUpdates, 12000);
  clearInterval(updateTimer);
  updateTimer = setInterval(checkForUpdates, 4 * 60 * 60 * 1000);
}

async function checkForUpdates() {
  if (!app.isPackaged) return { development: true };
  try {
    const updateUrl = await resolveUpdateUrl();
    if (!updateUrl) {
      activeUpdateUrl = null;
      sendUpdateStatus({ state: "setup-required" });
      return { enabled: false };
    }
    if (activeUpdateUrl !== updateUrl) {
      activeUpdateUrl = updateUrl;
      autoUpdater.setFeedURL({ provider: "generic", url: activeUpdateUrl });
    }
    return await autoUpdater.checkForUpdates();
  } catch (error) {
    sendUpdateStatus({ state: "error", message: error.message });
    return { error: error.message };
  }
}

const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  app.quit();
} else {
  app.on("second-instance", showMainWindow);
  app.whenReady().then(() => {
    app.setAppUserModelId("com.charisna.moneymanagement.desktop");
    if (app.isPackaged) {
      app.setLoginItemSettings({
        openAtLogin: true,
        args: ["--background"]
      });
    }
    createWindow();
    createTray();
    startReminderService();
    configureUpdater();
  });
}

ipcMain.handle("app:version", () => app.getVersion());
ipcMain.handle("window:hide", () => mainWindow?.hide());
ipcMain.handle("updates:check", checkForUpdates);
ipcMain.handle("updates:install", () => {
  isQuitting = true;
  autoUpdater.quitAndInstall(false, true);
});
ipcMain.handle("reminders:sync", (_event, items) => {
  pendingReminders = (Array.isArray(items) ? items : [])
    .map(sanitizeReminder)
    .filter((item) => item && item.at > Date.now() - 86400000)
    .sort((a, b) => a.at - b.at)
    .slice(0, MAX_REMINDERS);
  saveReminders();
  checkDueReminders();
  return { scheduled: pendingReminders.length };
});

app.on("before-quit", (event) => {
  if (
    !flushBeforeQuitDone &&
    !flushBeforeQuitStarted &&
    mainWindow &&
    !mainWindow.isDestroyed()
  ) {
    event.preventDefault();
    isQuitting = true;
    flushBeforeQuitStarted = true;

    const flush = mainWindow.webContents.executeJavaScript(
      "typeof flushCloudAutosave === 'function' ? flushCloudAutosave({ silent: true }) : Promise.resolve(false)"
    ).catch(() => false);
    const timeout = new Promise((resolve) => setTimeout(resolve, 5000));

    Promise.race([flush, timeout]).finally(() => {
      flushBeforeQuitDone = true;
      saveWindowState();
      app.quit();
    });
    return;
  }

  isQuitting = true;
  saveWindowState();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin" && isQuitting) app.quit();
});
app.on("activate", showMainWindow);
