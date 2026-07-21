"use strict";

const fs = require("node:fs");

const input = process.argv[2];
const output = process.argv[3];
const alignment = Number(process.argv[4] || 4);

if (!input || !output || !Number.isInteger(alignment) || alignment < 2) {
  throw new Error("Usage: node zipalign-apk.js <input.apk> <output.apk> [alignment]");
}

const data = fs.readFileSync(input);
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
const oldCentralSize = data.readUInt32LE(eocd + 12);
const oldCentralOffset = data.readUInt32LE(eocd + 16);
const entries = [];
let cursor = oldCentralOffset;

for (let index = 0; index < totalEntries; index += 1) {
  if (data.readUInt32LE(cursor) !== 0x02014b50) {
    throw new Error(`Invalid central-directory record at ${cursor}`);
  }

  const method = data.readUInt16LE(cursor + 10);
  const nameLength = data.readUInt16LE(cursor + 28);
  const extraLength = data.readUInt16LE(cursor + 30);
  const commentLength = data.readUInt16LE(cursor + 32);
  const localOffset = data.readUInt32LE(cursor + 42);
  const recordLength = 46 + nameLength + extraLength + commentLength;
  const name = data.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");

  entries.push({
    name,
    method,
    localOffset,
    centralRecord: Buffer.from(data.subarray(cursor, cursor + recordLength)),
    newLocalOffset: -1
  });

  cursor += recordLength;
}

if (cursor !== oldCentralOffset + oldCentralSize) {
  throw new Error("Central-directory size mismatch");
}

const localEntries = [...entries].sort((left, right) => left.localOffset - right.localOffset);
const chunks = [];
let outputLength = localEntries.length ? localEntries[0].localOffset : oldCentralOffset;

chunks.push(data.subarray(0, outputLength));

for (let index = 0; index < localEntries.length; index += 1) {
  const entry = localEntries[index];
  const oldRecordEnd = index + 1 < localEntries.length
    ? localEntries[index + 1].localOffset
    : oldCentralOffset;

  if (data.readUInt32LE(entry.localOffset) !== 0x04034b50) {
    throw new Error(`Invalid local header for ${entry.name}`);
  }

  const nameLength = data.readUInt16LE(entry.localOffset + 26);
  const extraLength = data.readUInt16LE(entry.localOffset + 28);
  const payloadOffset = entry.localOffset + 30 + nameLength + extraLength;
  const localPrefix = Buffer.from(data.subarray(entry.localOffset, payloadOffset));
  let paddingField = Buffer.alloc(0);

  if (entry.method === 0 && !entry.name.endsWith("/")) {
    const basePayloadOffset = outputLength + localPrefix.length;

    if (basePayloadOffset % alignment !== 0) {
      const paddingDataLength = (alignment - ((basePayloadOffset + 4) % alignment)) % alignment;
      paddingField = Buffer.alloc(4 + paddingDataLength);
      paddingField.writeUInt16LE(0xd935, 0);
      paddingField.writeUInt16LE(paddingDataLength, 2);
      localPrefix.writeUInt16LE(extraLength + paddingField.length, 28);
    }
  }

  entry.newLocalOffset = outputLength;
  const remainder = data.subarray(payloadOffset, oldRecordEnd);
  chunks.push(localPrefix, paddingField, remainder);
  outputLength += localPrefix.length + paddingField.length + remainder.length;
}

const newCentralOffset = outputLength;

for (const entry of entries) {
  entry.centralRecord.writeUInt32LE(entry.newLocalOffset, 42);
  chunks.push(entry.centralRecord);
  outputLength += entry.centralRecord.length;
}

const oldCentralEnd = oldCentralOffset + oldCentralSize;
const centralTrailer = data.subarray(oldCentralEnd, eocd);
chunks.push(centralTrailer);
outputLength += centralTrailer.length;

const newEocd = Buffer.from(data.subarray(eocd));
newEocd.writeUInt32LE(newCentralOffset, 16);
chunks.push(newEocd);

fs.writeFileSync(output, Buffer.concat(chunks));
console.log(`${output}: aligned ${totalEntries} entries to ${alignment}-byte boundaries`);
