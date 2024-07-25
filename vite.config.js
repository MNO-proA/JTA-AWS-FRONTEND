import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src',
    filename: 'sw.js',
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'JTA Residential Care',
      short_name: 'JTA Tracker',
      description: 'staff, shifts and expense management',
      theme_color: '#ffffff',
     icons: [
        {
          src: "/icons/icon-14x14.png",
          sizes: "14x14",
          type: "image/png"
        },
        {
          src: "/icons/icon-32x32.png",
          sizes: "32x32",
          type: "image/png"
        },
        {
          src: "/icons/icon-48x48.png",
          sizes: "48x48",
          type: "image/png"
        },
        {
          src: "/icons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png"
        },
        {
          src: "/icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png"
        },
        {
          src: "/icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png"
        },
        {
          src: "/icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png"
        },
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png"
        },
        {
          src: "/icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png"
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/icons/icon-1024x1024.png",
          sizes: "1024x1024",
          type: "image/png"
        }
  ],
    },

    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,pdf,jpg,png,svg}"],
      runtimeCaching: [
        {
          urlPattern: ({ url }) => {
            return url.pathname.startsWith("/api");
          },
          handler: "CacheFirst",
          options: {
            cacheName: "api-cache",
            cacheableResponse: {
              statuses: [200],
            },
          },
        },
      ], // Error handling
      navigateFallback: "/offline.html",
      additionalManifestEntries: [{ url: "/offline.html", revision: null }],
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})