import { FilterX, Search } from 'lucide-react';
import { filterStatusOptions } from './taskBoardFormat';
import type { TaskFilterStatus } from '../../lib/api';

type Props = {
  query: string;
  status: TaskFilterStatus | 'all';
  hasActiveFilters: boolean;
  onChangeQuery: (value: string) => void;
  onChangeStatus: (value: TaskFilterStatus | 'all') => void;
  onClearFilters: () => void;
};

export function TaskFilters({
  query,
  status,
  hasActiveFilters,
  onChangeQuery,
  onChangeStatus,
  onClearFilters,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <label className="relative block flex-1">
          <span className="sr-only">キーワード検索</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full rounded-2xl border border-slate-300 bg-white px-10 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={query}
            onChange={(event) => onChangeQuery(event.target.value)}
            placeholder="タイトル、説明、タグを検索"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            aria-label="状態絞り込み"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition sm:w-44 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={status}
            onChange={(event) => onChangeStatus(event.target.value as TaskFilterStatus | 'all')}
          >
            <option value="all">全ステータス</option>
            {filterStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
          >
            <FilterX size={16} />
            絞り込み解除
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>検索とステータスで一覧を絞り込めます。</p>
        <p>{hasActiveFilters ? '絞り込み中' : '全件表示中'}</p>
      </div>
    </div>
  );
}
