import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore - dev plugin type may not be present in runtime build
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Liquid Garden',
        short_name: 'LiquidGarden',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }: { request: Request }) => (request as any).destination === 'image',
            // @ts-ignore
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: ({ url }: { url: any }) => url.pathname.endsWith('.json'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'json-cache'
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
