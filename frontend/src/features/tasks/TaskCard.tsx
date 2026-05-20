import { Trash2 } from 'lucide-react';
import type { Task } from '../../lib/api';
import { formatDueDate } from './taskBoardFormat';
import { TaskStatusPill } from './TaskStatusPill';

type Props = {
  task: Task;
  onSelect: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskCard({ task, onSelect, onDelete }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <button
          className="text-left text-base font-semibold leading-snug text-slate-950 underline decoration-slate-300 underline-offset-4"
          type="button"
          onClick={() => onSelect(task)}
        >
          {task.title}
        </button>
        <button
          className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-slate-200 text-slate-700"
          type="button"
          aria-label={`${task.title}を削除`}
          onClick={() => onDelete(task)}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {task.description ? (
        <p className="mt-3 break-words text-sm leading-6 text-slate-600">{task.description}</p>
      ) : (
        <p className="mt-3 text-sm text-slate-400">説明はありません。</p>
      )}

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">状態</p>
          <div className="mt-1">
            <TaskStatusPill task={task} />
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">期限</p>
          <p className="mt-1 text-slate-800">{formatDueDate(task)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">タグ</p>
          <p className="mt-1 break-words text-slate-800">
            {task.tags.length > 0 ? task.tags.map((tag) => tag.name).join(', ') : '未設定'}
          </p>
        </div>
      </div>
    </article>
  );
}
