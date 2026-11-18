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
  build: {
    // Le SDK Firebase pèse à lui seul ~535 Ko (125 Ko compressé) et ne peut pas être découpé
    // davantage : on relève le seuil d'alerte juste au-dessus pour garder l'avertissement utile.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Bibliothèques lourdes et rarement modifiées dans des fichiers séparés :
        // le navigateur les garde en cache d'un déploiement à l'autre.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage", "firebase/functions", "firebase/app-check"],
          i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
        },
      },
    },
  },
  // Modules Firebase pré-assemblés dès le démarrage : sinon Vite en découvre un en cours de
  // route, recharge la page et peut en charger deux copies (« Service functions is not available »).
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage", "firebase/functions", "firebase/app-check"],
  },
  server: {
    port: 5173,
    // On désactive les logs inutiles
    strictPort: false,
  }
})