import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({mode}) => {
  const prod = mode === 'production'
  return {
    plugins: [dts({rollupTypes:true}), tsconfigPaths()],
    build: {
      lib: {
        entry: {
          "index" : resolve(__dirname, 'src/index.ts'),
        },
        formats: ['es'],
        //fileName: (_, entryName) => `${entryName}.js`
        fileName: 'index',
      },
      rollupOptions: {
        external: id => /\.spec\.d\.ts$/.test(id)
      },
      sourcemap: !prod,
    },
  }
})
