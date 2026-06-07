import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // TODO: drop apple-touch-icon-180.png, icon-192.png, icon-512.png, icon-maskable.png
      // into apps/web/public/ for full PWA installability. The manifest still references
      // them so iOS / Android show a proper home-screen icon once they exist.
      manifest: {
        name: 'Longstone Garden Feed',
        short_name: 'Longstone',
        description: 'Two-person feeding tracker for the garden at Longstone.',
        display: 'standalone',
        background_color: '#f8f5ec',
        theme_color: '#3f6b4a',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/plants') ||
              url.pathname.startsWith('/schedule') ||
              url.pathname.startsWith('/users'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'longstone-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
