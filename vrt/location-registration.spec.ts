import { test } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('LocationRegistrationPage Visual Tests', () => {
  test('should render location registration form correctly', async ({ page }) => {
    await page.goto('/location-registration');
    await takeScreenshot(page, 'location-registration-page');
  });
});