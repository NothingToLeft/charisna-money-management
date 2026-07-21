"use strict";

const fs = require("node:fs");

const file = process.argv[2];
const alignment = Number(process.argv[3] || 4);

if (!file) {
  throw new Error("Usage: node check-zip-alignment.js <apk> [alignment]");
}

const data = fs.readFileSync(file);
let eocd = -1;

for (let offset = data.length - 22; offset >= Math.max(0, data.length - 65557); offset -= 1) {
  if (data.readUInt32LE(offset) === 0x06054b50) {
    eocd = offset;
    break;
  }
}

if (eocd < 0) {
  throw new Error("ZIP end-of-central-directory record not found");
}

const totalEntries = data.readUInt16LE(eocd + 10);
let cursor = data.readUInt32LE(eocd + 16);
const unaligned = [];
let storedEntries = 0;

for (let index = 0; index < totalEntries; index += 1) {
  if (data.readUInt32LE(cursor) !== 0x02014b50) {
    throw new Error(`Invalid central-directory record at ${cursor}`);
  }

  const method = data.readUInt16LE(cursor + 10);
  const nameLength = data.readUInt16LE(cursor + 28);
  const extraLength = data.readUInt16LE(cursor + 30);
  const commentLength = data.readUInt16LE(cursor + 32);
  const localOffset = data.readUInt32LE(cursor + 42);
  const name = data.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");

  if (method === 0 && !name.endsWith("/")) {
    if (data.readUInt32LE(localOffset) !== 0x04034b50) {
      throw new Error(`Invalid local header for ${name}`);
    }

    const localNameLength = data.readUInt16LE(localOffset + 26);
    const localExtraLength = data.readUInt16LE(localOffset + 28);
    const payloadOffset = localOffset + 30 + localNameLength + localExtraLength;
    storedEntries += 1;

    if (payloadOffset % alignment !== 0) {
      unaligned.push({ name, payloadOffset, remainder: payloadOffset % alignment });
    }
  }

  cursor += 46 + nameLength + extraLength + commentLength;
}

console.log(JSON.stringify({ file, totalEntries, storedEntries, alignment, unaligned }, null, 2));
process.exitCode = unaligned.length ? 2 : 0;
