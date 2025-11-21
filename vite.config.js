import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const version = Date.now(); // timestamp versi otomatis

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  define: {
    "process.env": {},
  },
  build: {
    outDir: "dist",
    lib: {
      entry: "./app/embed/page.tsx",
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["es", "umd"],
    },
    cssCodeSplit: false,
  },

  // ✨ inject versi ke output
  esbuild: {
    define: {
      __WIDGET_VERSION__: JSON.stringify(version),
    },
  },
});
