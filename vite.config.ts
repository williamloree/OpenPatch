import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],

  // Remplacer les variables d'environnement pour le build
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    'global': 'globalThis'
  },

  build: {
    // Configuration pour le mode library (standalone)
    lib: {
      entry: resolve(__dirname, 'src/standalone.ts'),
      name: 'OpenPatch',
      formats: ['es', 'umd'],
      fileName: (format) => `openpatch.${format}.js`
    },
    rollupOptions: {
      // Externaliser les dépendances pour réduire la taille du bundle
      // Pour un widget standalone, on peut tout bundler
      output: {
        // Globals pour UMD build
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0]
          if (name === 'style.css') {
            return 'openpatch.css'
          }
          return name || 'asset'
        }
      }
    },
    // Output directory
    outDir: 'dist',
    emptyOutDir: true,
    // Minification pour production
    minify: 'esbuild'
  }
});
