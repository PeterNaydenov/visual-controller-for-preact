import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  publicDir: false,
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'VisualController',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `visual-controller-for-preact.${format === 'es' ? 'esm.mjs' : format === 'umd' ? 'umd.js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['preact', 'ask-for-promise'],
      output: {
        globals: { preact: 'preact', 'ask-for-promise': 'askForPromise' }
      }
    }
  }
})