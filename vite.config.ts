import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

// 從 package.json 讀取版本號
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  base: '/www/', // Base URL for GitHub Pages (repo name)
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  build: {
    assetsInlineLimit: 0, // Ensure assets are not inlined as base64
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    host: true
  }
});
