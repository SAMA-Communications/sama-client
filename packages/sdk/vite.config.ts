import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
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
