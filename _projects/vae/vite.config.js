import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the built app works when served from /assets/vae-app/
  base: './',
  plugins: [react()],
  root: '.',
  server: {
    open: true,
    port: 5173
  }
})
