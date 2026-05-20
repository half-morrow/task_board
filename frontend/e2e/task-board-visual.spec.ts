import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { visualTasks } from '../src/test/fixtures/taskBoardVisualData';

function uniqueId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function seedVisualTasks(page: Page) {
  for (const task of visualTasks) {
    const response = await page.request.post('/api/v1/tasks', {
      data: task,
    });

    expect(response.ok()).toBeTruthy();
  }
}

async function register(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByRole('button', { name: '新規登録' }).click();
  await page.getByLabel('ユーザ名').fill(username);
  await page.getByLabel('パスワード').fill(password);
  await page.getByRole('button', { name: '登録する' }).click();
  await expect(page.getByText(username)).toBeVisible();
}

test('captures the paginated task board visual state', async ({ page }) => {
  const id = uniqueId();
  const username = `vrt_user_${id}`;
  const password = `Password-${id}`;

  await page.setViewportSize({ width: 1280, height: 900 });
  await register(page, username, password);

  await seedVisualTasks(page);

  await page.goto('/');
  await expect(page.getByText('1〜20件 / 全22件')).toBeVisible();
  await expect(page.getByRole('button', { name: 'ビジュアル差分確認', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '月次請求書レビュー', exact: true })).toBeHidden();
  await expect(page.getByRole('cell', { name: '未着手 / 期限切れ' })).toBeVisible();

  await expect(page.locator('main > div').nth(1)).toHaveScreenshot('task-board-page-1.png');

  await page.getByRole('button').filter({ has: page.locator('svg.lucide-chevron-right') }).click();
  await expect(page.getByText('21〜22件 / 全22件')).toBeVisible();
  await expect(page.getByRole('button', { name: '月次請求書レビュー', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ビジュアル差分確認', exact: true })).toBeHidden();
});

test('keeps the mobile task card interactions usable', async ({ page }) => {
  const id = uniqueId();
  const username = `mob_user_${id}`;
  const password = `Password-${id}`;

  await page.setViewportSize({ width: 390, height: 844 });
  await register(page, username, password);
  await seedVisualTasks(page);

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'ビジュアル差分確認', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'ビジュアル差分確認', exact: true }).click();
  await expect(page.getByLabel('タイトル')).toHaveValue('ビジュアル差分確認');

  await page.getByRole('button', { name: 'ページネーション確認を削除' }).click();
  await expect(page.getByText('タスクを削除しました。')).toBeVisible();

  await page.getByRole('button', { name: '次のページ' }).click();
  await expect(page.getByText('21〜21件 / 全21件')).toBeVisible();
  await expect(page.getByRole('button', { name: '月次請求書レビュー', exact: true })).toBeVisible();
});
