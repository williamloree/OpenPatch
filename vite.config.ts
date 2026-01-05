import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
const isStandalone = mode === 'standalone';

return {
  plugins: [vue(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    'global': 'globalThis'
  },

  build: {
    lib: {
      entry: resolve(__dirname, isStandalone ? 'src/standalone.ts' : 'src/index.ts'),
      name: 'OpenPatch',
      formats: isStandalone ? ['es', 'umd'] : ['es'],
      fileName: (format) => isStandalone ? `openpatch.${format}.js` : `index.${format}.js`
    },
    rollupOptions: {
      external: isStandalone ? [] : ['vue'],
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
    emptyOutDir: !isStandalone,
    minify: 'esbuild'
  }
}
});
