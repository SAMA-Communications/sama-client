import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import dts from 'vite-plugin-dts'
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "SAMAuikit",
      fileName: (format) => `@sama-communications.ui-kit.${format}.js`,
      formats: ["es", "cjs"],
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
