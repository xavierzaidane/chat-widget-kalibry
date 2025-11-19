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
      external: [], 
      output: {
        inlineDynamicImports: true,
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})