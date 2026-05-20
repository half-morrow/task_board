import { ChevronLeft, ChevronRight, FilterX, RefreshCw, Trash2 } from 'lucide-react';
import type { Task } from '../../lib/api';
import { TASKS_PER_PAGE, formatDueDate, formatTaskCount } from './taskBoardFormat';
import { TaskCard } from './TaskCard';
import { TaskStatusPill } from './TaskStatusPill';

type Props = {
  loading: boolean;
  error: string;
  tasks: Task[];
  page: number;
  totalCount: number;
  totalPages: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export function TaskBoardState({
  loading,
  error,
  tasks,
  page,
  totalCount,
  totalPages,
  hasActiveFilters,
  onClearFilters,
  onRetry,
  onSelectTask,
  onDeleteTask,
  onPrevPage,
  onNextPage,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <RefreshCw className="animate-spin" size={18} />
          </div>
          <div>
            <p className="text-base font-medium text-slate-900">読み込み中</p>
            <p className="mt-1 text-sm text-slate-500">タスク一覧を更新しています。</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white px-6 py-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-950">一覧を表示できませんでした</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            type="button"
            onClick={onRetry}
          >
            <RefreshCw size={16} />
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <div className="mx-auto max-w-sm">
          <p className="text-base font-semibold text-slate-900">
            {hasActiveFilters ? '条件に一致するタスクがありません' : 'タスクがまだありません'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {hasActiveFilters
              ? '検索条件やステータスを見直すか、絞り込みを解除してください。'
              : '作成フォームから最初のタスクを追加できます。'}
          </p>
          {hasActiveFilters ? (
            <button
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900"
              type="button"
              onClick={onClearFilters}
            >
              <FilterX size={16} />
              絞り込みを解除
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden md:block">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-[40%] px-4 py-3 font-medium">タスク</th>
                <th className="w-[14%] px-4 py-3 font-medium">状態</th>
                <th className="w-[16%] px-4 py-3 font-medium">期限</th>
                <th className="w-[20%] px-4 py-3 font-medium">タグ</th>
                <th className="w-[10%] px-4 py-3 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-4">
                    <button
                      className="break-words text-left font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4"
                      type="button"
                      onClick={() => onSelectTask(task)}
                    >
                      {task.title}
                    </button>
                    {task.description ? (
                      <p className="mt-1 break-words text-slate-500">{task.description}</p>
                    ) : (
                      <p className="mt-1 text-slate-400">説明はありません。</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <TaskStatusPill task={task} />
                  </td>
                  <td className="px-4 py-4 text-slate-900">{formatDueDate(task)}</td>
                  <td className="px-4 py-4 text-slate-900">
                    {task.tags.length > 0 ? task.tags.map((tag) => tag.name).join(', ') : '未設定'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        type="button"
                        aria-label={`${task.title}を削除`}
                        onClick={() => onDeleteTask(task)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={onSelectTask} onDelete={onDeleteTask} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>{formatTaskCount(totalCount, page, TASKS_PER_PAGE)}</p>
          <p className="mt-1 text-xs text-slate-500">{totalPages === 0 ? '0ページ' : `${page}/${totalPages}ページ`}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={page <= 1}
            onClick={onPrevPage}
            aria-label="前のページ"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            disabled={totalPages === 0 || page >= totalPages}
            onClick={onNextPage}
            aria-label="次のページ"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
