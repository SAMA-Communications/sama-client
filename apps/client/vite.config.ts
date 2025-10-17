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

      "@components": createPath("src/components"),
      "@generic": createPath("src/components/generic"),
      "@screens": createPath("src/components/screens"),
      "@static": createPath("src/components/static"),
      "@skeletons": createPath("src/components/skeletons"),

      "@store": createPath("src/store"),
      "@services": createPath("src/services"),

      "@icons": createPath("src/assets/icons"),
      "@assets": createPath("src/assets"),
      "@styles": createPath("src/styles"),

      "@lib": createPath("src/lib"),
      "@utils": createPath("src/utils"),
      "@animations": createPath("src/animations"),
      "@validations": createPath("src/lib/validations"),

      "@hooks": createPath("src/hooks"),

      "@sama-communications.sdk": createPath("../../packages/sdk/dist/@sama-communications.sdk.es.js"),
      "@sama-communications.ui-kit": createPath("../../packages/ui-kit/dist/@sama-communications.ui-kit.es.js")
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
