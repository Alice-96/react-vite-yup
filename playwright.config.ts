import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定 - Visual Regression Testing用
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './vrt',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // テストレポート設定
  reporter: [
    ['html', { open: 'never', outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  // スナップショット設定
  expect: {
    toHaveScreenshot: {
      // アニメーションを無効化
      animations: 'disabled',
      // スナップショットの保存パス（プラットフォーム非依存）
      pathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
      // 許容する差分の閾値
      threshold: 0.2,
      maxDiffPixels: 100,
      // スナップショットの比較設定
      maxDiffPixelRatio: 0.01,
    },
  },

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // タイムアウト設定
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // テストプロジェクト（ブラウザ・ビューポート）
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1280, height: 720 },
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1280, height: 720 },
    //   },
    // },

    // // Mobile viewports
    // {
    //   name: 'mobile-chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    // // Tablet viewports
    // {
    //   name: 'tablet',
    //   use: {
    //     ...devices['iPad Pro'],
    //   },
    // },
  ],

  // Webサーバー設定
  webServer: {
    command: 'pnpm preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});