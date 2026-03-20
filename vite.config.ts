import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/jinsoo-clinic/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
