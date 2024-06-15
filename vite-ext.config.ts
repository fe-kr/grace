import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
    emptyOutDir: false,
    target: "node16",
    rollupOptions: {
      input: {
        content: "src/scripts/content/index.tsx",
        content_styles: "src/scripts/content/index.css",
        background: "src/scripts/background.ts",
      },
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
