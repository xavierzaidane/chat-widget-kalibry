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
    lib: {
      entry: "./app/embed/page.tsx",
      name: "KalibryChat",
      fileName: (format) => `kalibry-chat-widget.${format}.js`,
      formats: ["umd"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        format: "umd",
        name: "KalibryChat",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // Inline all CSS and assets
        assetFileNames: () => "[name][extname]",
      },
      external: [],
    },
    minify: "terser",
    target: "es2020",
  },
  css: {
    postcss: "./postcss.config.mjs",
  },
});
