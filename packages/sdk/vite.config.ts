import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [dts({ outDir: "./dist/types" })],
  build: {
    sourcemap: mode === "development",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SAMAClient",
      fileName: (format) => {
        if (format === "es") return `@sama-communications.sdk.mjs`;
        if (format === "cjs") return `@sama-communications.sdk.cjs`;
        return `@sama-communications.sdk.js`;
      },
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["ws"],
      output: {
        globals: {
          ws: "wsNode",
        },
      },
    },
  },
}));
