import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"), 
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: "./app/embed/page.tsx",
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      output: {
        assetFileNames: "chat-widget.css", 
      },
    },
  },
});