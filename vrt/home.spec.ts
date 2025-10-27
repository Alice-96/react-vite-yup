import { test } from '@playwright/test';
import { takeScreenshot, takeResponsiveScreenshots } from './helpers/screenshot';

test.describe('HomePage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render home page correctly', async ({ page }) => {
    await takeScreenshot(page, 'home-page');
  });

  test('should render home page responsively', async ({ page }) => {
    await takeResponsiveScreenshots(page, 'home-page', ['mobile', 'tablet', 'desktop']);
  });

  test('should handle hover states correctly', async ({ page }) => {
    const buttons = page.locator('button, a[href]');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // 最初のボタン/リンクをホバー
      await buttons.first().hover();
      await page.waitForTimeout(200);
      await takeScreenshot(page, 'home-page-hover');
    }
  });

  test('should handle focus states correctly', async ({ page }) => {
    const interactiveElements = page.locator('button, a[href], input');
    const elementCount = await interactiveElements.count();

    if (elementCount > 0) {
      // 最初のインタラクティブ要素にフォーカス
      await interactiveElements.first().focus();
      await page.waitForTimeout(200);
      await takeScreenshot(page, 'home-page-focus');
    }
  });
});