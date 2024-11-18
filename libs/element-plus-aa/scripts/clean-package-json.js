import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageJsonPath = path.resolve(__dirname, '../package.json')
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
