import { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import type { Status } from '../../lib/api';
import { taskStatusOptions, type FormState } from './taskBoardFormat';

type Props = {
  editingTaskId: number | null;
  form: FormState;
  saving: boolean;
  onCancelEdit: () => void;
  onChange: (next: FormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TaskForm({ editingTaskId, form, saving, onCancelEdit, onChange, onSubmit }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {editingTaskId ? 'Edit task' : 'New task'}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">{editingTaskId ? 'タスクを編集' : 'タスクを作成'}</h2>
        </div>
        {editingTaskId ? (
          <button
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
            type="button"
            onClick={onCancelEdit}
          >
            編集を解除
          </button>
        ) : null}
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="task-title">
            タイトル <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-title"
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={form.title}
            onChange={(event) => onChange({ ...form, title: event.target.value })}
            maxLength={120}
            required
            aria-describedby="task-title-help"
            placeholder="例: 月次レポートを確認"
          />
          <p id="task-title-help" className="mt-1 text-xs leading-5 text-slate-500">
            120文字以内で入力してください。
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="task-description">
            説明
          </label>
          <textarea
            id="task-description"
            className="mt-1 min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={form.description}
            onChange={(event) => onChange({ ...form, description: event.target.value })}
            maxLength={2000}
            aria-describedby="task-description-help"
            placeholder="進め方や確認ポイントを簡潔に書きます。"
          />
          <p id="task-description-help" className="mt-1 text-xs leading-5 text-slate-500">
            任意入力です。2000文字以内で入力してください。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="task-status">
              ステータス
            </label>
            <select
              id="task-status"
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={form.status}
              onChange={(event) => onChange({ ...form, status: event.target.value as Status })}
            >
              {taskStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="task-due-date">
              期限
            </label>
            <input
              id="task-due-date"
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              type="date"
              value={form.due_date}
              onChange={(event) => onChange({ ...form, due_date: event.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="task-tags">
            タグ
          </label>
          <input
            id="task-tags"
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={form.tags}
            onChange={(event) => onChange({ ...form, tags: event.target.value })}
            placeholder="frontend, review"
            aria-describedby="task-tags-help"
          />
          <p id="task-tags-help" className="mt-1 text-xs leading-5 text-slate-500">
            カンマ区切りで複数入力できます。
          </p>
        </div>

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {!editingTaskId ? <Plus size={16} /> : null}
          {saving ? '保存中...' : editingTaskId ? '更新する' : '作成する'}
        </button>
      </form>
    </section>
  );
}
