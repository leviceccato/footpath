import { defineConfig } from 'vite'
import gleamPlugin from 'vite-gleam'
import tailwindcssPlugin from '@tailwindcss/vite'

export default defineConfig({
  root: './src',
  clearScreen: false,
  plugins: [tailwindcssPlugin(), gleamPlugin()],
  server: {
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
