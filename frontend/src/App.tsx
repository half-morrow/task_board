import { useEffect, useState } from 'react';
import { AuthPanel } from './features/auth/AuthPanel';
import { TaskBoard } from './features/tasks/TaskBoard';
import { api, User } from './lib/api';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api
      .me()
      .then((response) => setUser(response.data))
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
          読み込み中...
        </div>
      </main>
    );
  }

  if (!user) {
    return <AuthPanel onAuthenticated={setUser} />;
  }

  return <TaskBoard user={user} onLogout={() => setUser(null)} />;
}
