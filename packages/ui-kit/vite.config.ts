import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { fileURLToPath, URL } from "node:url";

const createPath = (dir: String) => fileURLToPath(new URL(`./${dir}`, import.meta.url));

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true }), tailwindcss()],
  resolve: {
    alias: {
      "@src": createPath("src"),
      "@elements": createPath("src/components/elements"),
      "@composite": createPath("src/components/composite"),

      "@adapters": createPath("src/adapters"),

      "@types": createPath("src/types"),

      "@utils": createPath("src/utils"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "SAMAuikit",
      fileName: (format) => `@sama-communications.ui-kit.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
