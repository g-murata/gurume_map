import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // 全てのテストの前にランディングページへ移動
    await page.goto('/landing');
  });

  test('should show the main title', async ({ page }) => {
    // タイトル "GurumeMap" が表示されているか
    await expect(page.getByRole('heading', { name: 'GurumeMap' })).toBeVisible();
  });

  test('should show registration and login buttons', async ({ page }) => {
    // 画面内に複数ある場合は、少なくとも1つ表示されていることを確認
    await expect(page.getByRole('link', { name: '新規会員登録' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'ログイン' }).first()).toBeVisible();
  });

  test('should navigate to login page when login button is clicked', async ({ page }) => {
    // ログインボタンをクリック（複数ある場合は最初のものをクリック）
    await page.getByRole('link', { name: 'ログイン' }).first().click();
    await expect(page).toHaveURL(/\/login/);
  });
});
