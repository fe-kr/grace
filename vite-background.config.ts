import path from "node:path";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: "src/scripts/background.ts",
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
