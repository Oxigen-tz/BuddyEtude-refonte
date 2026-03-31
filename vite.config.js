import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// Configuration standard pour React + Vite
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // C'est ce qui permet d'utiliser le "@" dans tes imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // On désactive les logs inutiles
    strictPort: false,
  }
})