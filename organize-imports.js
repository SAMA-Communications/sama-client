/**
 * Organizes import statements across the project:
 * - Groups imports logically (React, React Router, Redux, external, internal aliases, relative)
 * - Sorts each group alphabetically by module path
 * - Ensures exactly one empty line after the last import (before component logic, exports, etc.)
 *
 * For packages/ui-kit only: converts relative paths to path aliases
 * (@elements, @composites, @utils, @types, @adapters, @src).
 *
 * Usage (from repository root sama-client):
 *   node organize-imports.js
 *
 * Processes: apps/client/src, packages/ui-kit/src
 * Skips: vite.config, vitest.setup, *.test.*, *.spec.*, *.mock.*
 */

const fs = require("fs");
const path = require("path");

function parseImports(content) {
  const lines = content.split(/\r?\n/);
  const imports = [];
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed === "" && imports.length > 0) {
      i++;
      continue;
    }
    if (!trimmed.startsWith("import ")) break;
    let block = lines[i];
    i++;
    while (i < lines.length) {
      if (/from\s+['"][^'"]+['"]\s*;?\s*$/.test(block)) break; // block already complete
      const next = lines[i];
      if (next.trim() === "" || next.trim().startsWith("import ")) break;
      block += "\n" + next;
      i++;
    }
    const fromMatch = block.match(/from\s+['"]([^'"]+)['"]/);
    const spec = fromMatch ? fromMatch[1] : (block.match(/['"]([^'"]+)['"]/) || [])[1];
    if (spec) imports.push({ raw: block.trimEnd(), spec });
  }
  return { imports, restStartIndex: i };
}

function getGroupKey(spec, useAliases, fileDir) {
  if (spec === "react" || spec.startsWith("react/")) return "0_react";
  if (spec === "react-dom" || spec.startsWith("react-dom/")) return "1_react-dom";
  if (spec.startsWith("react-router")) return "2_react-router";
  if (spec.startsWith("react-redux") || spec.includes("redux")) return "3_redux";
  if (spec.startsWith("@")) return "5_" + spec.split("/")[0];
  if (spec.startsWith(".")) {
    if (!useAliases) return "9_relative";
    const abs = path.resolve(fileDir, spec).replace(/\\/g, "/");
    const srcIdx = abs.indexOf("/src/");
    const src = srcIdx >= 0 ? abs.slice(srcIdx + 5) : null;
    if (!src) return "9_relative";
    if (src.startsWith("components/elements/")) return "5_@elements";
    if (src.startsWith("components/composites/")) return "5_@composites";
    if (src.startsWith("utils/")) return "5_@utils";
    if (src.startsWith("types/")) return "5_@types";
    if (src.startsWith("adapters")) return "5_@adapters";
    return "5_@src";
  }
  return "4_external";
}

function toAlias(spec, fileDir) {
  if (!spec.startsWith(".")) return spec;
  const abs = path.resolve(fileDir, spec).replace(/\\/g, "/");
  const srcIdx = abs.indexOf("/src/");
  const src = srcIdx >= 0 ? abs.slice(srcIdx + 5) : null;
  if (!src) return spec;
  const prefixes = [
    ["components/elements/", "@elements/"],
    ["components/composites/", "@composites/"],
    ["utils/", "@utils/"],
    ["types/", "@types/"],
    ["adapters", "@adapters"],
  ];
  for (const [pre, alias] of prefixes) {
    if (src === pre) return alias;
    if (pre.endsWith("/") && src.startsWith(pre)) return alias + src.slice(pre.length);
    if (!pre.endsWith("/") && (src === pre || src.startsWith(pre + "/"))) return alias + src.slice(pre.length);
  }
  return "@src/" + src;
}

function organize(content, filePath, useAliases) {
  const lines = content.split(/\r?\n/);
  const { imports, restStartIndex } = parseImports(content);
  if (imports.length === 0) return content;

  const fileDir = path.dirname(filePath);
  const isUiKit = filePath.includes(path.join("ui-kit", "src"));

  const groups = new Map();
  for (const imp of imports) {
    const spec = useAliases && isUiKit && imp.spec.startsWith(".") ? toAlias(imp.spec, fileDir) : imp.spec;
    const key = getGroupKey(spec, useAliases && isUiKit, fileDir);
    if (!groups.has(key)) groups.set(key, []);
    let raw = imp.raw;
    if (useAliases && isUiKit && imp.spec.startsWith(".") && spec !== imp.spec) {
      raw = imp.raw.replace(new RegExp(imp.spec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), spec);
    }
    groups.get(key).push({ raw, spec });
  }

  const sortedKeys = [...groups.keys()].sort();

  const importLines = [];
  for (const key of sortedKeys) {
    const list = groups.get(key).sort((a, b) => a.spec.localeCompare(b.spec, undefined, { sensitivity: "base" }));
    for (const { raw } of list) importLines.push(raw);
    importLines.push("");
  }
  if (importLines[importLines.length - 1] === "") importLines.pop();

  const rest = lines.slice(restStartIndex).join("\n").replace(/^\n+/, "");
  return importLines.join("\n") + "\n\n" + rest;
}

function processFile(filePath, useAliases) {
  const full = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
  const content = fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const newContent = organize(content, full, useAliases);
  const changed = newContent !== content;
  if (changed) fs.writeFileSync(full, newContent, "utf8");
  return changed;
}

function walk(dir, exts, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== "dist" && e.name !== "__mocks__") walk(full, exts, result);
    } else if (exts.some((x) => e.name.endsWith(x))) {
      result.push(full);
    }
  }
  return result;
}

const ROOTS = [
  [path.join(__dirname, "apps", "client", "src"), false],
  [path.join(__dirname, "packages", "ui-kit", "src"), true],
];
const EXTS = [".js", ".jsx", ".ts", ".tsx"];
const SKIP = (p) =>
  p.includes("vite.config") ||
  p.includes("vitest.setup") ||
  /\.(test|spec)\.(tsx?|jsx?)$/.test(p) ||
  /\.mock\.(ts|tsx)$/.test(p);

for (const [root, useAliases] of ROOTS) {
  const name = root.includes("ui-kit") ? "packages/ui-kit" : "apps/client";
  let n = 0;
  for (const f of walk(root, EXTS)) {
    if (!SKIP(f) && processFile(f, useAliases)) n++;
  }
  console.log("%s: %d files updated.", name, n);
}
console.log("Done.");
