export default {
  '*.{js,ts,vue}': ['eslint --cache', () => 'vue-tsc --noEmit -p ./apps/example/tsconfig.json'],
  '*.{js,ts,vue,css,md}': 'prettier --write'
}
