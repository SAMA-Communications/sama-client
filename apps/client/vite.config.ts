import path from "node:path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const r = (dir: string) => path.resolve(__dirname, dir);

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  preview: { port: 3000 },
  server: { port: 3000 },
  resolve: {
    alias: {
      "@src": r("src"),
      "@api": r("src/api"),

      "@components": r("src/components"),
      "@generic": r("src/components/generic"),
      "@screens": r("src/components/screens"),
      "@static": r("src/components/static"),

      "@store": r("src/store"),
      "@services": r("src/services"),

      "@icons": r("src/assets/icons"),
      "@assets": r("src/assets"),
      "@styles": r("src/styles"),

      "@lib": r("src/lib"),
      "@utils": r("src/utils"),
      "@animations": r("src/animations"),
      "@validations": r("src/lib/validations"),

      "@hooks": r("src/hooks"),

      "@sama-communications.sdk": r("../../packages/sdk/dist/@sama-communications.sdk.es.js"),
      "@sama-communications.ui-kit": r("../../packages/ui-kit/dist/@sama-communications.ui-kit.es.js"),
      "@sama-communications.ui-kit.css": r("../../packages/ui-kit/dist/ui-kit.css"),
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
