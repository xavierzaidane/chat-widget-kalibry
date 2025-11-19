import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, './app/embed/page.tsx'),
      name: 'ChatWidgetEmbed',
      fileName: 'chat-widget-embed',
      formats: ['iife']
    },
    rollupOptions: {
      // JANGAN external React - bundle semua dependencies
      external: [],
      output: {
        // Tidak perlu globals karena semua dibundle
        inlineDynamicImports: true,
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})