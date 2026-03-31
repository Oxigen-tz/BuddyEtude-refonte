<<<<<<< HEAD
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
    // On désactive les logs inutiles de Base44
    strictPort: false,
  }
=======
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
    // On désactive les logs inutiles de Base44
    strictPort: false,
  }
>>>>>>> 6b88a12f674c32552cb3079a33c97e7810e3fe29
})