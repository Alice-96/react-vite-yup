import { test } from '@playwright/test';
import { takeScreenshot } from './helpers/screenshot';

test.describe('UserListPage Visual Tests', () => {
  test('should render user list page with data', async ({ page }) => {
    await page.goto('/user-list');
    
    // データが読み込まれるまで待機
    await page.waitForSelector('text=ユーザー一覧', { timeout: 10000 });
    await page.waitForTimeout(1000); // データの読み込み完了を確実にするため
    
    await takeScreenshot(page, 'user-list-page');
  });
});