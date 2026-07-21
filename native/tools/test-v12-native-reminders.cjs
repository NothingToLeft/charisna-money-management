"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://charisna.test/",
  runScripts: "dangerously"
});
const { window } = dom;
const scheduled = [];
const cancelled = [];

window.Capacitor = {
  isNativePlatform: () => true,
  Plugins: {
    LocalNotifications: {
      schedule: async ({ notifications }) => scheduled.push(...notifications),
      cancel: async ({ notifications }) => cancelled.push(...notifications),
      requestPermissions: async () => ({ display: "granted" }),
      checkPermissions: async () => ({ display: "granted" })
    }
  }
};

const due = new Date(Date.now() + 2 * 86400000);
const nextDate = [
  due.getFullYear(),
  String(due.getMonth() + 1).padStart(2, "0"),
  String(due.getDate()).padStart(2, "0")
].join("-");

window.state = {
  settings: {
    billReminderEnabled: true,
    billReminderDays: [1],
    pushPrivacyMode: "generic"
  },
  recurring: [{
    id: "qa-bill",
    active: true,
    type: "expense",
    reminderEnabled: true,
    nextDate,
    reminderDays: [1],
    name: "Tagihan QA",
    currency: "IDR",
    amount: 100000
  }]
};

window.eval(fs.readFileSync(
  path.resolve(__dirname, "../www/native-bootstrap.js"),
  "utf8"
));

(async () => {
  if (!window.CharisnaNativeReminders?.available) {
    throw new Error("Backend Capacitor LocalNotifications tidak terdeteksi.");
  }

  await window.CharisnaNativeReminders.sync();
  if (scheduled.length !== 1 || !scheduled[0]?.schedule?.at) {
    throw new Error(`Jadwal native gagal: ${JSON.stringify(scheduled)}`);
  }

  window.state.settings.billReminderEnabled = false;
  await window.CharisnaNativeReminders.sync();
  if (cancelled.length !== 1) {
    throw new Error(`Jadwal lama tidak dibatalkan: ${JSON.stringify(cancelled)}`);
  }
  if (window.localStorage.getItem("charisna-native-reminder-ids-v12") !== "[]") {
    throw new Error("Daftar reminder lama belum dibersihkan.");
  }

  console.log(JSON.stringify({
    ok: true,
    backend: "Capacitor LocalNotifications",
    scheduled: scheduled.length,
    cancelledAfterDisable: cancelled.length,
    calendarEntriesCreated: 0
  }, null, 2));
  window.close();
})().catch((error) => {
  console.error(error);
  window.close();
  process.exitCode = 1;
});
