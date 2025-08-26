#!/usr/bin/env node

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const packageJsonPath = path.resolve('package.json')

console.log('Updating @vek-element/ui-components version in package.json...')

try {
  // Получаем последнюю версию @vek-element/ui-components из npm
  const latestVersion = execSync('npm show @vek-element/ui-components version', {
    encoding: 'utf8'
  }).trim()

  // Читаем текущий package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString())

  // Обновляем версию зависимости
  if (packageJson.dependencies && packageJson.dependencies['@vek-element/ui-components']) {
    packageJson.dependencies['@vek-element/ui-components'] = `${latestVersion}`
  } else {
    console.error('Dependency @vek-element/ui-components not found in package.json')
    process.exit(1)
  }

  // Записываем обновленный package.json обратно в файл
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
  console.log(`Updated @vek-element/ui-components to version ^${latestVersion}`)
} catch (error) {
  if (error instanceof Error) {
    console.error('Error updating @vek-element/ui-components version:', error.message)
  } else {
    console.error('An unknown error occurred:', error)
  }
  process.exit(1)
}
