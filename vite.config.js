import { defineConfig } from 'vite'
import gleamPlugin from 'vite-gleam'
import tailwindPlugin from '@tailwindcss/vite'

export default defineConfig({
  root: './src',
  clearScreen: false,
  plugins: [gleamPlugin(), tailwindPlugin()],
  server: {
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
