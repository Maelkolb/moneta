import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  base: process.env.MONETA_BASE ?? '/',
  plugins: [preact()],
  build: { target: 'es2022' },
  test: { environment: 'node' },
})
