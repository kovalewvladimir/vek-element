import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

console.log('Cleaning package.json...')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.argv.length !== 3) {
  console.error('Usage: node clean-package-json.js <path-to-package.json>')
  process.exit(1)
}

const packageJsonPath = path.resolve(__dirname, process.argv[2])
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

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

fieldsToRemove.forEach((field) => {
  delete packageJson[field]
})

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
