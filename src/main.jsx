import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// 🌙 Initialisation du mode sombre avant même que l'écran ne s'affiche
if (localStorage.getItem('buddyetude_theme') === 'dark' || 
    (!('buddyetude_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)