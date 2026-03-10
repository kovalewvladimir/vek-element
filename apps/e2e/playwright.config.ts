import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  outputDir: '/tmp/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'null',

  use: {
    baseURL: 'http://localhost:8999',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: {
    command: 'npm run dev',
    cwd: '../../',
    url: 'http://localhost:8999',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
