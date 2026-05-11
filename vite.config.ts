import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import { copyFileSync, mkdirSync } from 'node:fs'

function copyPreload() {
  const copy = () => {
    mkdirSync('dist-electron', { recursive: true })
    copyFileSync('electron/preload.cjs', 'dist-electron/preload.cjs')
    console.log('[preload] copied → dist-electron/preload.cjs')
  }
  return {
    name: 'copy-preload-cjs',
    buildStart: copy,
    watchChange(id: string) { if (id.includes('preload.cjs')) copy() },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    copyPreload(),
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        // По умолчанию vite-plugin-electron запускает `electron .` → грузит
        // устаревший root/main.js. Явно указываем скомпилированный файл,
        // чтобы Electron всегда использовал актуальный dist-electron/main.js
        // с правильным PRELOAD_PATH → dist-electron/preload.cjs.
        onstart({ startup }) {
          startup(['dist-electron/main.js', '--no-sandbox'])
        },
      },
    ]),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
