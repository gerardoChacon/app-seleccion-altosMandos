import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En Windows+Docker, Vite no detecta cambios de archivos automáticamente.
    // usePolling hace que revise los archivos cada 100ms para detectar cambios.
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
})
