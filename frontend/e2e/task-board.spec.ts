import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

function uniqueId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function taskTitleButton(page: Page, title: string) {
  return page.getByRole('button', { name: title, exact: true });
}

async function register(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByRole('button', { name: '新規登録' }).click();
  await page.getByLabel('ユーザ名').fill(username);
  await page.getByLabel('パスワード').fill(password);
  await page.getByRole('button', { name: '登録する' }).click();
  await expect(page.getByText(username)).toBeVisible();
}

async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByLabel('ユーザ名').fill(username);
  await page.getByLabel('パスワード').fill(password);
  await page.getByRole('button', { name: 'ログインする' }).click();
  await expect(page.getByText(username)).toBeVisible();
}

async function logout(page: Page) {
  await page.getByRole('button', { name: 'ログアウト' }).click();
  await expect(page.getByRole('button', { name: '新規登録' })).toBeVisible();
}

test('supports the core task flow and keeps tasks scoped to the signed-in user', async ({ page }) => {
  const id = uniqueId();
  const password = `Password-${id}`;
  const owner = `e2e_owner_${id}`;
  const other = `e2e_other_${id}`;
  const ownerTask = `owner task ${id}`;
  const otherTask = `other task ${id}`;
  const updatedTask = `updated task ${id}`;

  await register(page, owner, password);
  await page.getByLabel('タイトル').fill(ownerTask);
  await page.getByLabel('説明').fill('visible only to the owner');
  await page.getByRole('button', { name: '作成する' }).click();
  await expect(taskTitleButton(page, ownerTask)).toBeVisible();

  await logout(page);
  await login(page, owner, password);
  await expect(taskTitleButton(page, ownerTask)).toBeVisible();
  await logout(page);

  await register(page, other, password);
  await expect(page.getByText(ownerTask)).toHaveCount(0);

  await page.getByLabel('タイトル').fill(otherTask);
  await page.getByLabel('説明').fill('created by the second user');
  await page.getByRole('button', { name: '作成する' }).click();
  await expect(taskTitleButton(page, otherTask)).toBeVisible();

  await taskTitleButton(page, otherTask).click();
  await page.getByLabel('タイトル').fill(updatedTask);
  await page.getByLabel('説明').fill('updated by the second user');
  await page.getByLabel('ステータス').selectOption('in_progress');
  await page.getByRole('button', { name: '更新する' }).click();
  await expect(taskTitleButton(page, updatedTask)).toBeVisible();
  await expect(page.getByRole('cell', { name: '進行中' })).toBeVisible();
  await expect(page.getByText(otherTask)).toHaveCount(0);

  await page.getByRole('button', { name: `${updatedTask}を削除` }).click();
  await expect(page.getByText(updatedTask)).toHaveCount(0);
  await expect(page.getByText('タスクがまだありません')).toBeVisible();

  await logout(page);
});

test('shows expired tasks and a notice when a past-due task is created', async ({ page }) => {
  const id = uniqueId();
  const username = `e2e_expired_${id}`;
  const password = `Password-${id}`;
  const title = `expired task ${id}`;
  const dueDate = '2026-05-15';

  await register(page, username, password);
  await page.getByLabel('タイトル').fill(title);
  await page.getByLabel('説明').fill('created from the e2e test');
  await page.getByLabel('期限').fill(dueDate);

  await page.getByRole('button', { name: '作成する' }).click();

  await expect(page.getByRole('button', { name: title, exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: '未着手 / 期限切れ' })).toBeVisible();
  await expect(page.getByText('期限切れとして保存しました。')).toBeVisible();
});
