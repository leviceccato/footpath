import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import gleam from 'vite-gleam'

export default defineConfig({
  root: './src',
  clearScreen: false,
  plugins: [tailwindcss(), gleam()],
  server: {
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
