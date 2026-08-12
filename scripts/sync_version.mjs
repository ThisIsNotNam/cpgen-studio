#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";

const TAURI_CONF = "src-tauri/tauri.conf.json";
const MD_FILES = ["README.md", "ROADMAP.md"];

const VERSION_PATTERN = /`\d+\.\d+\.\d+(?:-[\w.]+)?`/g;

const { version } = JSON.parse(readFileSync(TAURI_CONF, "utf8"));
const replacement = `\`${version}\``;

let changed = false;

for (const file of MD_FILES) {
  const content = readFileSync(file, "utf8");
  const updated = content.replace(VERSION_PATTERN, replacement);

  if (updated !== content) {
    writeFileSync(file, updated);
    console.log(`Updated ${file} -> ${version}`);
    changed = true;
  }
}

if (!changed) {
  console.log(`No changes needed, already at ${version}`);
}
