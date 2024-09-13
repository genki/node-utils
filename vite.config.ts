import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        "index" : resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es'],
      fileName: (_, entryName) => `${entryName}.js`
    },
  },
})
