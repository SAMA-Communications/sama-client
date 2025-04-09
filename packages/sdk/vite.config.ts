import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SAMAClient",
      fileName: (format) => `@sama-communications.sdk.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ['get-browser-fingerprint'],
      output: {
        globals: {
          'get-browser-fingerprint': 'getBrowserFingerprint'
        }
      },
    },
  },
});
