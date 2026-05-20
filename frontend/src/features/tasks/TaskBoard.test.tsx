import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskBoard } from './TaskBoard';
import { api, type Task, type User } from '../../lib/api';

vi.mock('../../lib/api', () => ({
  api: {
    tasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Sample task',
    description: null,
    status: 'todo',
    is_expired: false,
    due_date: null,
    tags: [],
    created_at: '2026-05-21T12:00:00.000Z',
    updated_at: '2026-05-21T12:00:00.000Z',
    ...overrides,
  };
}

const user: User = {
  id: 1,
  username: 'demo',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TaskBoard', () => {
  it('shows expired tasks with a clear label', async () => {
    mockedApi.tasks.mockResolvedValue({
      data: [buildTask({ title: 'Expired task', is_expired: true })],
      meta: { page: 1, per_page: 20, total_count: 1, total_pages: 1 },
    });

    render(<TaskBoard user={user} onLogout={vi.fn()} />);

    expect((await screen.findAllByText('未着手 / 期限切れ')).length).toBeGreaterThan(0);
  });

  it('shows a no-result state and lets the user clear filters', async () => {
    mockedApi.tasks.mockResolvedValue({
      data: [],
      meta: { page: 1, per_page: 20, total_count: 0, total_pages: 0 },
    });

    render(<TaskBoard user={user} onLogout={vi.fn()} />);

    expect((await screen.findAllByText('タスクがまだありません')).length).toBeGreaterThan(0);

    fireEvent.change(screen.getAllByPlaceholderText('タイトル、説明、タグを検索')[0], {
      target: { value: 'sample' },
    });

    expect(await screen.findByText('条件に一致するタスクがありません')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: '絞り込み解除' })[0]);
    await waitFor(() => expect(screen.getAllByPlaceholderText('タイトル、説明、タグを検索')[0]).toHaveValue(''));
  });

  it('shows an inline notice when a new task is saved as expired', async () => {
    mockedApi.tasks.mockResolvedValue({
      data: [],
      meta: { page: 1, per_page: 20, total_count: 0, total_pages: 0 },
    });
    mockedApi.createTask.mockResolvedValue({
      data: buildTask({ title: 'Past due task', is_expired: true }),
    });

    render(<TaskBoard user={user} onLogout={vi.fn()} />);

    expect((await screen.findAllByText('タスクがまだありません')).length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText(/タイトル/), { target: { value: 'Past due task' } });
    fireEvent.change(screen.getByLabelText('期限'), { target: { value: '2026-05-20' } });
    fireEvent.click(screen.getAllByRole('button', { name: '作成する' })[0]);

    await waitFor(() => expect(mockedApi.createTask).toHaveBeenCalled());
    expect(await screen.findByText('期限切れとして保存しました。')).toBeInTheDocument();
  });

  it('shows task operation failures inline without replacing the task list error state', async () => {
    mockedApi.tasks.mockResolvedValue({
      data: [buildTask({ title: 'Loaded task' })],
      meta: { page: 1, per_page: 20, total_count: 1, total_pages: 1 },
    });
    mockedApi.createTask.mockRejectedValue(new Error('保存に失敗しました'));

    render(<TaskBoard user={user} onLogout={vi.fn()} />);

    expect((await screen.findAllByText('Loaded task')).length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText(/タイトル/), { target: { value: 'New task' } });
    fireEvent.click(screen.getByRole('button', { name: '作成する' }));

    expect(await screen.findByText('保存に失敗しました')).toBeInTheDocument();
    expect(screen.queryByText('一覧を表示できませんでした')).not.toBeInTheDocument();
  });
});
