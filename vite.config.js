import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  // load .env, .env.local, .env.[mode]
  const env = loadEnv(mode, process.cwd(), "");

  // pick needed vars and stringify
  const VITE_CHAT_API_URL = env.VITE_CHAT_API_URL || env.NEXT_PUBLIC_CHAT_API_URL || "";

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./app"),
      },
    },
    define: {
      // expose only what you need
      "import.meta.env.VITE_CHAT_API_URL": JSON.stringify(VITE_CHAT_API_URL),
      // keep process.env empty if not used
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
  });
};
