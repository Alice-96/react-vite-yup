import { test } from '@playwright/test';
import { takeScreenshot, takeResponsiveScreenshots } from './helpers/screenshot';

test.describe('UserListPage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user-list');
  });

  test('should render user list page with data', async ({ page }) => {
    // データが読み込まれるまで待機
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // データの読み込み完了を確実にするため

    await takeScreenshot(page, 'user-list-page');
  });

  test('should render user list responsively', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await takeResponsiveScreenshots(page, 'user-list', ['mobile', 'tablet', 'desktop']);
  });

  test('should display loading state correctly', async ({ page }) => {
    // ローディング状態をキャプチャ（ページロード直後）
    await page.goto('/user-list', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100); // ローディングインジケーターが表示されるまで少し待つ

    const loadingIndicator = page.locator('[role="progressbar"], .loading, .spinner');
    if (await loadingIndicator.count() > 0 && await loadingIndicator.isVisible()) {
      await takeScreenshot(page, 'user-list-loading');
    }
  });

  test('should display table interactions correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // テーブル行をホバー
    const tableRows = page.locator('table tbody tr, [role="row"]');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      await tableRows.first().hover();
      await page.waitForTimeout(200);
      await takeScreenshot(page, 'user-list-row-hover');
    }
  });

  test('should display pagination correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // ページネーションがある場合、それをキャプチャ
    const pagination = page.locator('[role="navigation"], .pagination, nav');
    if (await pagination.count() > 0 && await pagination.isVisible()) {
      await takeScreenshot(page, 'user-list-with-pagination');
    }
  });

  test('should display empty state correctly', async ({ page }) => {
    // 空の状態を表示するために、データがない状態をテスト
    // 注: 実際のアプリケーションのルーティングに応じて調整が必要
    const emptyState = page.locator('.empty-state, [data-testid="empty-state"]');
    if (await emptyState.count() > 0 && await emptyState.isVisible()) {
      await takeScreenshot(page, 'user-list-empty');
    }
  });
});