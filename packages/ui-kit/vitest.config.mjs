import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {},
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
  },
});
