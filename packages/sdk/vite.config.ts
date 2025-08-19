import path from "node:path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [ dts({ outDir: './dist/types' }) ],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SAMAClient",
      fileName: (format) => {
        if (format === "es") return `@sama-communications.sdk.mjs`
        if (format === "cjs") return `@sama-communications.sdk.cjs`
        return `@sama-communications.sdk.js`
      },
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ['ws'],
      output: {
        globals: {
          'ws': 'wsNode'
        }
      },
    },
  },
});
