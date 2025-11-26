import path from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "SAMAuikit",
      fileName: (format) => {
        if (format === "es") return `@sama-communications.ui-kit.mjs`
        if (format === "cjs") return `@sama-communications.ui-kit.cjs`
        return `@sama-communications.ui-kit.js`
      },
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
  },
});
