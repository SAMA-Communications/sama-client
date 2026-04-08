import path from "node:path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const r = (dir: string) => path.resolve(__dirname, dir);

/**
 * Vite + React (client): QuickJS requires Node (`node:fs`, `node:path`, `memfs` etc.).
 * @see https://sebastianwessel.github.io/quickjs/docs/index.html#vite
 *
 * Buffer/global/process: false in the plugin — otherwise __*_polyfill in .vite/deps (react-dom).
 * Global process is imported once in src/process-browser-polyfill.js (import first in index.js).
 */
export default defineConfig(({ mode }) => ({
  plugins: [
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: false,
        global: false,
        process: false,
      },
      // QuickJS createVirtualFileSystem imports readFileSync from node:fs — empty shim is not suitable
      overrides: {
        fs: "memfs",
      },
    }),
    react(),
    svgr(),
    tailwindcss(),
  ],
  preview: { port: 3000 },
  server: { port: 3000 },
  css: { devSourcemap: mode === "development" },
  resolve: {
    alias: {
      "rate-limiter-flexible": r("src/stubs/rate-limiter-flexible-browser.js"),
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
    include: ["memfs", "@sebastianwessel/quickjs", "@jitl/quickjs-singlefile-browser-release-sync", "process"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    sourcemap: mode === "development",
  },
}));
