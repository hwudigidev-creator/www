import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['DD_LOGO.svg', 'DD_LOGO.png'],
      manifest: {
        name: 'HWU 數位設計系',
        short_name: '數位設計系',
        description: '醒吾科技大學數位設計系 - AI輔助設計、動畫、遊戲、互動多媒體',
        theme_color: '#131314',
        background_color: '#131314',
        display: 'standalone',
        scope: '/www/',
        start_url: '/www/',
        icons: [
          {
            src: 'DD_LOGO.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'DD_LOGO.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'DD_LOGO.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  base: '/www/',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 3000,
    open: true
  }
})
