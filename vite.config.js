import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/SpellingBee/',
  plugins: [VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Spell It: SpellingBee',
        short_name: 'Spell It',
        description: 'A spelling quiz app for higher grade',
        background_color: '#000',
        display: 'standalone',
        start_url: '/SpellingBee',
        scope: '/',
        orientation: 'portrait',
        theme_color: '#000',
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
		},
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
		},
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
  		},
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
  		}
	]
      }
    })
  ],
});