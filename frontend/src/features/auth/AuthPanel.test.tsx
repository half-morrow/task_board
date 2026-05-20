import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthPanel } from './AuthPanel';
import { api, type User } from '../../lib/api';

vi.mock('../../lib/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

const user: User = {
  id: 1,
  username: 'demo',
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res, _reject) => {
    resolve = res;
  });

  return { promise, resolve };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthPanel', () => {
  it('keeps the panel focused on the form copy', () => {
    render(<AuthPanel onAuthenticated={vi.fn()} />);

    expect(screen.queryByText('List')).not.toBeInTheDocument();
    expect(screen.queryByText('CRUD')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile')).not.toBeInTheDocument();
    expect(screen.getByText('画面内で完結するタスク管理を想定しています。')).toBeInTheDocument();
  });

  it('disables auth controls while submitting', async () => {
    const pending = deferred<{ data: User }>();
    mockedApi.login.mockReturnValue(pending.promise);
    const onAuthenticated = vi.fn();

    render(<AuthPanel onAuthenticated={onAuthenticated} />);

    fireEvent.change(screen.getByLabelText('ユーザ名'), { target: { value: 'demo' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログインする' }));

    expect(screen.getByRole('button', { name: 'ログイン中...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '新規登録' })).toBeDisabled();
    expect(screen.getByLabelText('ユーザ名')).toBeDisabled();
    expect(screen.getByLabelText('パスワード')).toBeDisabled();

    pending.resolve({ data: user });
    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledWith(user));
  });
});
