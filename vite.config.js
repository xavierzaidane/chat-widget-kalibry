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
  publicDir: "public",
  build: {
    outDir: "dist",
    cssCodeSplit: false, // single CSS output
    lib: {
      entry: "./app/embed/page.tsx",
      name: "ChatWidget",
      formats: ["es", "umd"],
      fileName: (format) => (format === 'es' ? 'chat-widget.mjs' : 'chat-widget.umd.js'),
    },
    rollupOptions: {
      output: {
        // ensure CSS ends up as chat-widget.css
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'chat-widget.css';
          return assetInfo.name || '[name][extname]';
        },
        inlineDynamicImports: true,
      }
    }
  }
});
