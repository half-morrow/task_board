import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { LogOut } from 'lucide-react';
import { api, Task, TaskFilterStatus, User } from '../../lib/api';
import {
  TASKS_PER_PAGE,
  emptyForm,
  isFiltering,
  toForm,
  toInput,
  type FormState,
  type NoticeState,
} from './taskBoardFormat';
import { TaskBoardNotice } from './TaskBoardNotice';
import { TaskBoardState } from './TaskBoardState';
import { TaskFilters } from './TaskFilters';
import { TaskForm } from './TaskForm';

type Props = {
  user: User;
  onLogout: () => void;
};

export function TaskBoard({ user, onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TaskFilterStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState<NoticeState>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const hasActiveFilters = useMemo(() => isFiltering(query, status), [query, status]);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams({
      page: String(page),
      per_page: String(TASKS_PER_PAGE),
    });

    if (query.trim()) {
      searchParams.set('q', query.trim());
    }

    if (status !== 'all') {
      searchParams.set('status', status);
    }

    return searchParams;
  }, [page, query, status]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      const response = await api.tasks(params);
      setTasks(response.data);
      setTotalCount(response.meta.total_count);
      setTotalPages(response.meta.total_pages);

      const nextPage = response.meta.total_pages === 0 ? 1 : Math.min(page, response.meta.total_pages);
      if (nextPage !== page) {
        setPage(nextPage);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'タスクの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [page, params]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks, refreshToken]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setActionError('');
    setNotice(null);

    try {
      const input = toInput(form);
      const isEditing = editingTaskId !== null;
      const response = isEditing ? await api.updateTask(editingTaskId, input) : await api.createTask(input);

      setForm(emptyForm);
      setEditingTaskId(null);
      setPage(1);
      setRefreshToken((current) => current + 1);

      if (!isEditing && response.data.is_expired) {
        setNotice({ tone: 'info', message: '期限切れとして保存しました。' });
      } else {
        setNotice({
          tone: 'success',
          message: isEditing ? 'タスクを更新しました。' : 'タスクを作成しました。',
        });
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'タスクの保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    setActionError('');

    try {
      await api.logout();
      onLogout();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'ログアウトに失敗しました');
    }
  }

  async function deleteTask(task: Task) {
    setActionError('');
    setNotice(null);

    try {
      await api.deleteTask(task.id);

      if (editingTaskId === task.id) {
        setEditingTaskId(null);
        setForm(emptyForm);
      }

      setNotice({ tone: 'success', message: 'タスクを削除しました。' });
      setRefreshToken((current) => current + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'タスクの削除に失敗しました');
    }
  }

  function selectTask(task: Task) {
    setEditingTaskId(task.id);
    setForm(toForm(task));
    setNotice(null);
  }

  function updateSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateStatus(value: TaskFilterStatus | 'all') {
    setStatus(value);
    setPage(1);
  }

  function clearFilters() {
    setQuery('');
    setStatus('all');
    setPage(1);
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setForm(emptyForm);
    setNotice({ tone: 'info', message: '編集を解除しました。' });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.18),_transparent_36%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),transparent_60%)]" />

      <header className="sticky top-0 z-10 border-b border-white/60 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Task Board</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">タスクの流れをひと目で整理する</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">ログイン中: {user.username}</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            type="button"
            onClick={logout}
          >
            <LogOut size={16} />
            ログアウト
          </button>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
        <TaskForm
          editingTaskId={editingTaskId}
          form={form}
          saving={saving}
          onCancelEdit={cancelEdit}
          onChange={setForm}
          onSubmit={(event) => submit(event)}
        />

        <section className="space-y-4">
          <TaskFilters
            query={query}
            status={status}
            hasActiveFilters={hasActiveFilters}
            onChangeQuery={updateSearch}
            onChangeStatus={updateStatus}
            onClearFilters={clearFilters}
          />

          <TaskBoardNotice notice={actionError ? { tone: 'error', message: actionError } : notice} />

          <TaskBoardState
            loading={loading}
            error={loadError}
            tasks={tasks}
            page={page}
            totalCount={totalCount}
            totalPages={totalPages}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onRetry={() => setRefreshToken((current) => current + 1)}
            onSelectTask={selectTask}
            onDeleteTask={deleteTask}
            onPrevPage={() => setPage((current) => Math.max(1, current - 1))}
            onNextPage={() => setPage((current) => current + 1)}
          />
        </section>
      </div>
    </main>
  );
}
