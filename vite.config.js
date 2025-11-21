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
      entry: "./app/embed/page.tsx",  // file entry point widget
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["es", "umd"],         // ES module + UMD
    },
    cssCodeSplit: false,             // CSS dijadikan satu file
    minify: "esbuild",               // minify untuk kecilkan bundle
    sourcemap: false,                // optional: matikan source map
  },
  define: {
    "process.env": {},                // untuk menghindari error env di browser
  },
});
