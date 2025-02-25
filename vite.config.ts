import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const createPath = (dir: String) =>
  fileURLToPath(new URL(`./${dir}`, import.meta.url));

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  preview: { port: 3000 },
  server: { port: 3000 },
  resolve: {
    alias: {
      "@src": createPath("src"),
      "@api": createPath("src/api"),

      "@adapters": createPath("src/adapters"),
      "@helpers": createPath("src/_helpers"),

      "@components": createPath("src/components"),
      "@generic": createPath("src/components/generic"),
      "@screens": createPath("src/components/screens"),
      "@static": createPath("src/components/static"),

      "@store": createPath("src/store"),
      "@event": createPath("src/event"),
      "@services": createPath("src/services"),

      "@animations": createPath("src/animations"),
      "@icons": createPath("src/assets/icons"),
      "@styles": createPath("src/styles"),

      "@utils": createPath("src/utils"),
      "@validations": createPath("src/validations"),

      "@skeletons": createPath("src/skeletons"),
      "@hooks": createPath("src/hooks"),
    },
  },
  esbuild: {
    loader: "jsx",
    include: /.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
