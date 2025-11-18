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
  define: {
    'process.env': {} 
  },
  build: {
    outDir: "dist",
    lib: {
      entry: "./app/embed/page.tsx",
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["umd"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
      external: [],
    },
  },
  css: {
    postcss: './postcss.config.mjs',
  },
});
