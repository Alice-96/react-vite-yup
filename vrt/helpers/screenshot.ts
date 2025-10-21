import { Page, expect } from '@playwright/test';

export interface ScreenshotOptions {
  fullPage?: boolean;
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timeout?: number;
}

/**
 * VRTテスト用のスクリーンショット撮影ヘルパー
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options: ScreenshotOptions = {}
) {
  // ページが完全に読み込まれるまで待機
  await page.waitForLoadState('networkidle');
  
  // アニメーションを無効化
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });

  // 短時間待機してスタイルが適用されるのを確保
  await page.waitForTimeout(100);

  // スクリーンショットを撮影して比較
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: options.fullPage ?? true,
    clip: options.clip,
    timeout: options.timeout ?? 10000,
  });
}

/**
 * 特定のコンポーネントのスクリーンショットを撮影
 */
export async function takeComponentScreenshot(
  page: Page,
  selector: string,
  name: string,
  options: Omit<ScreenshotOptions, 'clip'> = {}
) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  
  // アニメーションを無効化
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });

  await page.waitForTimeout(100);
  
  await expect(element).toHaveScreenshot(`${name}-component.png`, {
    timeout: options.timeout ?? 10000,
  });
}

/**
 * フォームの各状態のスクリーンショットを撮影
 */
export async function takeFormStateScreenshots(
  page: Page,
  formSelector: string,
  testName: string
) {
  // 初期状態
  await takeComponentScreenshot(page, formSelector, `${testName}-initial`);
  
  // フォーカス状態（最初の入力フィールドにフォーカス）
  const firstInput = page.locator(`${formSelector} input, ${formSelector} textarea`).first();
  if (await firstInput.count() > 0) {
    await firstInput.focus();
    await takeComponentScreenshot(page, formSelector, `${testName}-focused`);
  }
  
  // エラー状態を確認するためにフォーム送信を試行
  const submitButton = page.locator(`${formSelector} button[type="submit"], ${formSelector} [role="button"]`).first();
  if (await submitButton.count() > 0) {
    await submitButton.click();
    await page.waitForTimeout(500); // バリデーションエラーが表示されるまで待機
    await takeComponentScreenshot(page, formSelector, `${testName}-validation-error`);
  }
}

/**
 * レスポンシブデザインのテスト用ビューポートサイズ
 */
export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 },
};

/**
 * 複数のビューポートでスクリーンショットを撮影
 */
export async function takeResponsiveScreenshots(
  page: Page,
  name: string,
  viewportSizes: Array<keyof typeof viewports> = ['mobile', 'tablet', 'desktop']
) {
  for (const size of viewportSizes) {
    await page.setViewportSize(viewports[size]);
    await page.waitForTimeout(300); // リサイズの完了を待つ
    await takeScreenshot(page, `${name}-${size}`);
  }
}