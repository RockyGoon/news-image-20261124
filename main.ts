/**
 * news-image-20261124 — "Tuesday 24 November 2026" front page.
 *
 * The entry artwork is a single pre-rendered PNG that lives next to this
 * file. Running this program copies it, byte for byte, to the output
 * directory the harness expects, so the submitted image is exactly the
 * artwork that was reviewed. No network access, no randomness, no
 * image generation at run time: the same input always yields the same
 * output bytes.
 *
 * Usage:
 *   MAKEFUN_OUTPUT_DIR=/path/to/output node main.ts
 *   (without MAKEFUN_OUTPUT_DIR the image is written to ./output)
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576; // 1 MiB, the competition limit
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

/** Parse the IHDR chunk and require exactly 1024x1024, rejecting anything else. */
function checkIhdr(bytes: Buffer): void {
  // PNG layout: 8-byte signature, then 4-byte length, 4-byte "IHDR",
  // then 4-byte width (BE), 4-byte height (BE), 1-byte bit depth,
  // 1-byte colour type. IHDR data starts at offset 16.
  if (bytes.length < 33) {
    fail(`entry.png is ${bytes.length} bytes; too short for a PNG IHDR chunk`);
  }
  const chunkType = bytes.subarray(12, 16).toString("ascii");
  if (chunkType !== "IHDR") {
    fail(`first PNG chunk is ${JSON.stringify(chunkType)}, expected "IHDR"`);
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  const bitDepth = bytes[24];
  const colourType = bytes[25];
  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    fail(`entry.png is ${width}x${height}; must be ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
  }
  if (bitDepth !== 8 || (colourType !== 2 && colourType !== 6)) {
    fail(`unexpected PNG format: bit depth ${bitDepth}, colour type ${colourType}`);
  }
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = join(here, "entry.png");

  if (!existsSync(source)) {
    fail(`entry.png not found next to main.ts (${source})`);
  }

  const bytes = readFileSync(source);
  if (bytes.length === 0 || bytes.length > MAX_BYTES) {
    fail(`entry.png is ${bytes.length} bytes; must be 1..${MAX_BYTES}`);
  }
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("entry.png does not start with the PNG signature");
  }
  checkIhdr(bytes);
  const sourceDigest = sha256(bytes);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "output");
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.png");

  // Copy through an explicit buffer write so the output is a fresh file
  // with exactly the source bytes, regardless of the caller's cwd.
  writeFileSync(target, bytes);

  const written = statSync(target);
  if (written.size !== bytes.length) {
    fail(`wrote ${written.size} bytes, expected ${bytes.length}`);
  }
  if (written.size > MAX_BYTES) {
    fail(`output is ${written.size} bytes, over the ${MAX_BYTES} byte cap`);
  }

  // Re-read the output and prove it is a byte-identical copy: same size,
  // same PNG signature and IHDR, same SHA-256 as the source artwork.
  const outBytes = readFileSync(target);
  const outDigest = sha256(outBytes);
  if (outDigest !== sourceDigest) {
    fail(`output sha256 ${outDigest} does not match source sha256 ${sourceDigest}`);
  }
  checkIhdr(outBytes);

  console.log(`wrote ${target} (${bytes.length} bytes, sha256 ${outDigest})`);
}

main();
