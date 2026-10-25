import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@shared': resolve('src/shared') }
  },
  test: {
    include: ['src/**/*.test.ts'],
    // Unit tests run in Node.js, not Electron: this file replaces the Electron APIs
    setupFiles: ['src/main/test/setup.ts']
  }
})
