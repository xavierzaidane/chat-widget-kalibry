import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-embed',
    lib: {
      entry: resolve(__dirname, './app/embed/page.tsx'),
      name: 'ChatWidgetEmbed',
      fileName: 'chat-widget-embed',
      formats: ['iife']
    },
    rollupOptions: {
      external: ['react', 'react-dom/client'],
      output: {
        globals: {
          'react': 'React',
          'react-dom/client': 'ReactDOM'
        },
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