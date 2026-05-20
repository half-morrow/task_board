import { FormEvent, useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { api, User } from '../../lib/api';

type Props = {
  onAuthenticated: (_user: User) => void;
};

export function AuthPanel({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response =
        mode === 'login' ? await api.login(username, password) : await api.register(username, password);
      onAuthenticated(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '認証に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-6 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-xl items-center">
        <section className="w-full rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Task Board</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950">タスクの見通しを、すぐに整えられる</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            検索、絞り込み、期限、タグをひとつの画面で扱える管理画面です。
          </p>

          <div className="mt-6 flex rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
              }`}
              type="button"
              onClick={() => setMode('login')}
              disabled={submitting}
            >
              ログイン
            </button>
            <button
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'register' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
              }`}
              type="button"
              onClick={() => setMode('register')}
              disabled={submitting}
            >
              新規登録
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="username">
                ユーザ名
              </label>
              <input
                id="username"
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                パスワード
              </label>
              <input
                id="password"
                className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                disabled={submitting}
              />
            </div>
            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
            ) : null}
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
            >
              {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
              {submitting ? `${mode === 'login' ? 'ログイン' : '登録'}中...` : mode === 'login' ? 'ログインする' : '登録する'}
            </button>
          </form>

          <p className="mt-4 text-xs leading-6 text-slate-500">
            画面内で完結するタスク管理を想定しています。
          </p>
        </section>
      </div>
    </main>
  );
}
