import { test } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('UserRegistrationPage Visual Tests', () => {
  test('should render user registration form correctly', async ({ page }) => {
    await page.goto('/user-registration');
    await takeScreenshot(page, 'user-registration-page');
  });
});