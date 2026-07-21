"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("CharisnaDesktop", {
  platform: process.platform,
  isDesktop: true,
  getVersion: () => ipcRenderer.invoke("app:version"),
  authStorage: {
    status: () => ipcRenderer.invoke("auth-storage:status"),
    getItem: (key) => ipcRenderer.invoke("auth-storage:get", key),
    setItem: (key, value) => ipcRenderer.invoke("auth-storage:set", key, value),
    removeItem: (key) => ipcRenderer.invoke("auth-storage:remove", key),
    clear: () => ipcRenderer.invoke("auth-storage:clear")
  },
  syncReminders: (items) => ipcRenderer.invoke("reminders:sync", items),
  checkForUpdates: () => ipcRenderer.invoke("updates:check"),
  installUpdate: () => ipcRenderer.invoke("updates:install"),
  minimizeToTray: () => ipcRenderer.invoke("window:hide"),
  onUpdateStatus: (callback) => {
    const listener = (_event, status) => callback(status);
    ipcRenderer.on("updates:status", listener);
    return () => ipcRenderer.removeListener("updates:status", listener);
  }
});
