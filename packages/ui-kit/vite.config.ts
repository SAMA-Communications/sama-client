import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const createPath = (dir: String) => fileURLToPath(new URL(`./${dir}`, import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [react(), dts({ insertTypesEntry: true }), tailwindcss()],
  css: { devSourcemap: mode === "development" },
  resolve: {
    alias: {
      "@src": createPath("src"),
      "@elements": createPath("src/components/elements"),
      "@composites": createPath("src/components/composites"),

      "@adapters": createPath("src/adapters"),

      "@types": createPath("src/types"),

      "@utils": createPath("src/utils"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SAMAuikit",
      fileName: (format) => {
        if (format === "es") return `@sama-communications.ui-kit.mjs`;
        if (format === "cjs") return `@sama-communications.ui-kit.cjs`;
        return `@sama-communications.ui-kit.js`;
      },
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: "@sama-communications.ui-kit[extname]",
      },
    },
    sourcemap: mode === "development",
  },
}));
