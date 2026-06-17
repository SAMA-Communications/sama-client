/**
 * A single global `process` for the browser (memfs / util / stream).
 * Do not use process: true у vite-plugin-node-polyfills — it duplicates __process_polyfill in the react-dom pre-bundle.
 */
import process from "process";

if (typeof globalThis.process === "undefined") {
  globalThis.process = process;
}
