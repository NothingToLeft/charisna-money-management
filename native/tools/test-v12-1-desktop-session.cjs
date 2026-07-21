"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const main = fs.readFileSync(
  path.join(root, "desktop", "main.cjs"),
  "utf8"
);

const preload = fs.readFileSync(
  path.join(root, "desktop", "preload.cjs"),
  "utf8"
);

const app = fs.readFileSync(
  path.join(root, "www", "app.js"),
  "utf8"
);

const index = fs.readFileSync(
  path.join(root, "www", "index.html"),
  "utf8"
);

assert.match(main, /safeStorage/);
assert.match(main, /secure-cloud-session\.bin/);
assert.match(main, /auth-storage:get/);
assert.match(main, /auth-storage:set/);
assert.match(main, /auth-storage:clear/);

assert.match(preload, /authStorage/);
assert.match(preload, /auth-storage:get/);
assert.match(preload, /auth-storage:clear/);

assert.match(app, /createDesktopAuthStorage/);
assert.match(app, /Migrasi otomatis sesi v12 lama/);
assert.match(app, /authStorage\?\.clear/);
assert.match(app, /Memulihkan sesi akun Windows/);

assert.match(index, /desktopStartupOverlay/);

// Password akun cloud tidak pernah dikirim ke penyimpanan native.
// Yang disimpan hanya token sesi yang dikelola Supabase.
assert.doesNotMatch(main, /cloudPassword|signInWithPassword/);
assert.doesNotMatch(preload, /cloudPassword|signInWithPassword/);

console.log("PASS v12.1 desktop secure-session audit");
