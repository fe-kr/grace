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
    rollupOptions: {
      input: {
        content: "src/scripts/content.tsx",
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
