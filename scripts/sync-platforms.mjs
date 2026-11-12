import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const webDir = path.join(rootDir, "web");
const wwwDir = path.join(rootDir, "www");
const winAppDir = path.join(rootDir, "windows", "app");

function walkFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, base));
    } else if (entry.isFile()) {
      files.push(path.relative(base, fullPath));
    }
  }
  return files;
}

function copyFilePreserve(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function sha256File(file) {
  const content = fs.readFileSync(file);
  return crypto.createHash("sha256").update(content).digest("hex");
}

console.log("== Syncing platforms from web/ to www/ and windows/app/ ==");
const webFiles = walkFiles(webDir).sort();

for (const destDir of [wwwDir, winAppDir]) {
  console.log(`\nSyncing to: ${path.relative(rootDir, destDir)} (${webFiles.length} files)...`);
  for (const rel of webFiles) {
    if (rel === "FILE-INTEGRITY-SHA256.txt") continue;
    const src = path.join(webDir, rel);
    const dest = path.join(destDir, rel);
    copyFilePreserve(src, dest);
  }
}

// Compute integrity hash list for web/
console.log("\nGenerating updated FILE-INTEGRITY-SHA256.txt...");
const integrityLines = [];
for (const rel of webFiles) {
  if (rel === "FILE-INTEGRITY-SHA256.txt") continue;
  const normalizedRel = rel.replace(/\\/g, "/");
  const fullPath = path.join(webDir, rel);
  const hash = sha256File(fullPath);
  integrityLines.push(`${hash}  ${normalizedRel}`);
}

const integrityContent = integrityLines.join("\n") + "\n";
fs.writeFileSync(path.join(webDir, "FILE-INTEGRITY-SHA256.txt"), integrityContent, "utf8");
fs.writeFileSync(path.join(wwwDir, "FILE-INTEGRITY-SHA256.txt"), integrityContent, "utf8");
fs.writeFileSync(path.join(winAppDir, "FILE-INTEGRITY-SHA256.txt"), integrityContent, "utf8");

console.log(`✓ Synchronized ${webFiles.length} files across web/, www/, and windows/app/.`);
console.log("✓ Updated FILE-INTEGRITY-SHA256.txt across all 3 platforms.");
