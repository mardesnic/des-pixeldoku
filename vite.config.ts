import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/des-pixeldoku/',
  plugins: [
    react(),
    // Installable from the browser menu, and works offline once loaded.
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: { config: true },
      manifest: {
        // A fixed id of its own, so a phone never mixes it up with an earlier
        // install or with the other games on this site.
        id: 'des-pixeldoku',
        name: 'Pixeldoku',
        short_name: 'Pixeldoku',
        description: 'A picture logic puzzle for kids that works offline',
        theme_color: '#c2255c',
        background_color: '#f4f5f7',
        display: 'standalone',
      },
    }),
  ],
});
