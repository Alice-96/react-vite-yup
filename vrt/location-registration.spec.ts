import { test } from '@playwright/test';
import { takeScreenshot, takeFormStateScreenshots, takeResponsiveScreenshots } from './helpers/screenshot';

test.describe('LocationRegistrationPage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/location-registration');
  });

  test('should render location registration form correctly', async ({ page }) => {
    await takeScreenshot(page, 'location-registration-page');
  });

  test('should render form responsively', async ({ page }) => {
    await takeResponsiveScreenshots(page, 'location-registration', ['mobile', 'tablet', 'desktop']);
  });

  test('should display form states correctly', async ({ page }) => {
    const form = page.locator('form');
    if (await form.count() > 0) {
      await takeFormStateScreenshots(page, 'form', 'location-registration-form');
    }
  });

  test('should display filled form correctly', async ({ page }) => {
    // フォームフィールドに値を入力
    const locationNameInput = page.locator('input[name="locationName"], input[id*="location"]').first();
    const addressInput = page.locator('input[name="address"], textarea[name="address"]').first();

    if (await locationNameInput.count() > 0) {
      await locationNameInput.fill('東京本社');
    }
    if (await addressInput.count() > 0) {
      await addressInput.fill('東京都千代田区丸の内1-1-1');
    }

    await page.waitForTimeout(300);
    await takeScreenshot(page, 'location-registration-filled');
  });

  test('should display validation errors correctly', async ({ page }) => {
    // 空のフォームを送信してバリデーションエラーを表示
    const submitButton = page.locator('button[type="submit"]').first();

    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(500);
      await takeScreenshot(page, 'location-registration-validation-errors');
    }
  });

  test('should display select dropdown correctly', async ({ page }) => {
    // セレクトボックスがある場合、開いた状態をテスト
    const selectElements = page.locator('select, [role="combobox"]');
    const selectCount = await selectElements.count();

    if (selectCount > 0) {
      await selectElements.first().click();
      await page.waitForTimeout(300);
      await takeScreenshot(page, 'location-registration-select-open');
    }
  });
});