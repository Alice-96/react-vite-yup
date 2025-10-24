import { test } from '@playwright/test';
import { takeScreenshot, takeFormStateScreenshots, takeResponsiveScreenshots } from './helpers/screenshot';

test.describe('UserRegistrationPage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user-registration');
  });

  test('should render user registration form correctly', async ({ page }) => {
    await takeScreenshot(page, 'user-registration-page');
  });

  test('should render form responsively', async ({ page }) => {
    await takeResponsiveScreenshots(page, 'user-registration', ['mobile', 'tablet', 'desktop']);
  });

  test('should display form states correctly', async ({ page }) => {
    const form = page.locator('form');
    if (await form.count() > 0) {
      await takeFormStateScreenshots(page, 'form', 'user-registration-form');
    }
  });

  test('should display filled form correctly', async ({ page }) => {
    // フォームフィールドに値を入力
    const nameInput = page.locator('input[name="name"], input[id*="name"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();

    if (await nameInput.count() > 0) {
      await nameInput.fill('テストユーザー');
    }
    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');
    }

    await page.waitForTimeout(300);
    await takeScreenshot(page, 'user-registration-filled');
  });

  test('should display validation errors correctly', async ({ page }) => {
    // 空のフォームを送信してバリデーションエラーを表示
    const submitButton = page.locator('button[type="submit"]').first();

    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(500); // バリデーションエラーの表示を待つ
      await takeScreenshot(page, 'user-registration-validation-errors');
    }
  });
});