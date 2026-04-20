import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  }
})