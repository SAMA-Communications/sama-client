import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const createPath = (dir) => fileURLToPath(new URL(`./${dir}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@src": createPath("src"),
      "@elements": createPath("src/components/elements"),
      "@composites": createPath("src/components/composites"),
      "@adapters": createPath("src/adapters"),
      "@types": createPath("src/types"),
      "@utils": createPath("src/utils"),
      types: createPath("src/types"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/vitest.setup.ts",

    include: ["src/components/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist"],

    css: true,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,

    coverage: {
      reporter: ["text", "lcov"],
    },
  },

  plugins: [react()],
});
