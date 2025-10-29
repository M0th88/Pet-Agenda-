import { fileURLToPath, URL } from 'node:url' // 1. Importa esto
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: { // 2. Añade la sección resolve
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})