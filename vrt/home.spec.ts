import { test } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('HomePage Visual Tests', () => {
  test('should render home page correctly', async ({ page }) => {
    await page.goto('/');
    await takeScreenshot(page, 'home-page');
  });
});