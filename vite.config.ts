import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    'global': 'globalThis'
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/standalone.ts'),
      name: 'OpenPatch',
      formats: ['es', 'umd'],
      fileName: (format) => `openpatch.${format}.js`
    },
    rollupOptions: {
      output: {
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0]
          if (name === 'style.css') {
            return 'open-patch.css'
          }
          return name || 'asset'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild'
  }
});
