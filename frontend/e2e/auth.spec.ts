import { test, expect } from '@playwright/test';

test.describe('Authenticated Flow', () => {
  test.beforeEach(({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`BROWSER ERROR: ${msg.text()}`);
    });
  });

  test('should create a new restaurant and check review button responsiveness', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('MOCK_AUTH_USER', 'test-user@example.com');
    });

    // --- API モックの定義 ---
    await page.route(/\/api\/v1\//, async route => {
      const url = route.request().url();
      const method = route.request().method();

      if (method === 'POST' && url.includes('restraunts')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            restraunt: { id: 1001, name: 'Playwrightの美味しい店', lat: 35.6, lng: 139.7, area_id: 2, created_at: new Date().toISOString() }
          })
        });
      } else if (url.includes('reviews/check_user_review')) {
        // レビュー投稿ボタンが出るかどうかを左右するフラグ
        // true = レビュー未投稿 (ボタンが出るはず), false = 投稿済み
        await route.fulfill({ status: 200, body: JSON.stringify({ review: true }) });
      } else if (url.includes('reviews/show_review')) {
        await route.fulfill({ status: 200, body: JSON.stringify({ review: [] }) });
      } else if (method === 'POST' && url.includes('tags_tagged_items')) {
        await route.fulfill({ status: 200, body: JSON.stringify({ tags_tagged_item: { id: 1 } }) });
      } else {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ restraunts: [], tags: [], areas: [] })
        });
      }
    });

    await page.goto('/');
    await page.waitForSelector('text=Loading...', { state: 'hidden', timeout: 20000 });

    // 1. お店を登録する
    const testRegisterBtn = page.getByTestId('test-open-register-modal');
    await testRegisterBtn.click();
    await page.getByLabel('店名').fill('Playwrightの美味しい店');
    await page.getByRole('button', { name: 'このお店を登録する' }).click();

    // 2. 登録が完了し、リストに表示されるのを待つ
    await expect(page.getByText('新規店名登録')).not.toBeVisible({ timeout: 10000 });
    const listItem = page.getByText('Playwrightの美味しい店').first();
    await expect(listItem).toBeVisible();

    // 3. お店をクリックして詳細画面を開く
    await listItem.click();

    // 4. 「✍️ レビューを投稿する」ボタンが表示されているか、反応するか確認
    // ここが動かない場合、ボタンが出ていないか、クリックしても反応しないはず
    const reviewBtn = page.getByRole('button', { name: '✍️ レビューを投稿する' });
    
    // ボタンの存在確認
    await expect(reviewBtn).toBeVisible({ timeout: 10000 });

    // 5. ボタンをクリック
    await reviewBtn.click();

    // 6. レビュー投稿モーダル（ReviewModal）が開いたか検証
    // 「評価」という文字（ReactStarsRating などのラベル）を探す
    await expect(page.getByText('評価').first()).toBeVisible();
    await expect(page.getByText('あなたのレビュー')).toBeVisible();
  });

  test('should redirect to landing when not logged in', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/landing/);
  });
});
