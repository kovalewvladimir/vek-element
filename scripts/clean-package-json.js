import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

console.log('Cleaning package.json...')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.argv.length !== 3) {
  throw new Error('Usage: node clean-package-json.js <path-to-package.json>')
}

const packageJsonPath = path.resolve(__dirname, process.argv[2])
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))

const fieldsToRemove = [
  'devDependencies',
  'scripts',
  'eslintConfig',
  'jest',
  'husky',
  'lint-staged',
  'prettier',
  'browserslist'
]

for (const field of fieldsToRemove) {
  delete packageJson[field]
}

// Удаление поля development из exports
if (packageJson.exports) {
  for (const key in packageJson.exports) {
    if (packageJson.exports[key].development) {
      delete packageJson.exports[key].development
    }
  }
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
console.log('package.json cleaned')
