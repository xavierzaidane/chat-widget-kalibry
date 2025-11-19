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
    "process.env": {},
  },

  build: {
    outDir: "dist",

    // Library mode (Shopify ScriptTag)
    lib: {
      entry: "./app/embed/page.tsx",
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["es", "umd"],
    },

    // ⛔ Default (false) — but we must set this TRUE if we want correct CSS bundling with rollup
    cssCodeSplit: false,

    // ⛔ Must disable asset file splitting to avoid missing files in Shopify
    rollupOptions: {
      output: {
        // required for Shopify: avoid broken asset paths
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
