import { defineConfig, transformerCompileClass } from 'unocss'

export default defineConfig({
  transformers: [
    transformerCompileClass({
      classPrefix: 'ela-'
    })
  ]
})
