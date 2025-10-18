/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: false, // globalsを無効化
    environment: 'node',
    include: ['src/**/*.test.ts'], // TypeScriptファイルのみ
  },
})