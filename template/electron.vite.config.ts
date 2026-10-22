import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'

const alias = {
  '@shared': resolve('src/shared'),
  '@renderer': resolve('src/renderer/src')
}

export default defineConfig({
  main: {
    resolve: { alias },
    build: {
      // Packages listed in `dependencies` stay external (loaded from node_modules at runtime).
      // Everything in `devDependencies` is bundled. electron-store is ESM-only, so it must be bundled.
      externalizeDeps: { exclude: ['electron-store'] }
    }
  },
  preload: {
    resolve: { alias }
  },
  renderer: {
    resolve: { alias },
    plugins: [
      // Must come before the React plugin
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: resolve('src/renderer/src/routes'),
        generatedRouteTree: resolve('src/renderer/src/routeTree.gen.ts')
      }),
      react(),
      tailwindcss()
    ]
  }
})
