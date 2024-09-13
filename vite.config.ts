import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        "index" : resolve(__dirname, 'src/index.ts'),
      },
      formats: ['cjs'],
      fileName: (format, entryName) => `${entryName}.${format}`
    },
  },
})
