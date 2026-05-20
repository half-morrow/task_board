import type { Status, Task, TaskFilterStatus, TaskInput } from '../../lib/api';

export type FormState = {
  title: string;
  description: string;
  status: Status;
  due_date: string;
  tags: string;
};

export type NoticeTone = 'success' | 'error' | 'info';

export type NoticeState =
  | {
      tone: NoticeTone;
      message: string;
    }
  | null;

export const TASKS_PER_PAGE = 20;

export const emptyForm: FormState = {
  title: '',
  description: '',
  status: 'todo',
  due_date: '',
  tags: '',
};

export const taskStatusOptions: Array<{ value: Status; label: string }> = [
  { value: 'todo', label: '未着手' },
  { value: 'in_progress', label: '進行中' },
  { value: 'done', label: '完了' },
];

export const filterStatusOptions: Array<{ value: TaskFilterStatus; label: string }> = [
  ...taskStatusOptions,
  { value: 'expired', label: '期限切れ' },
];

const statusLabels: Record<Status, string> = {
  todo: '未着手',
  in_progress: '進行中',
  done: '完了',
};

const statusBadgeClasses: Record<Status, string> = {
  todo: 'border-slate-200 bg-slate-50 text-slate-700',
  in_progress: 'border-sky-200 bg-sky-50 text-sky-800',
  done: 'border-emerald-200 bg-emerald-50 text-emerald-800',
};

const noticeToneClasses: Record<NoticeTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
};

export function toInput(form: FormState): TaskInput {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    due_date: form.due_date,
    tag_names: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}

export function toForm(task: Task): FormState {
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    due_date: task.due_date ?? '',
    tags: task.tags.map((tag) => tag.name).join(', '),
  };
}

export function formatTaskStatus(task: Task) {
  return task.is_expired ? `${statusLabels[task.status]} / 期限切れ` : statusLabels[task.status];
}

export function formatDueDate(task: Task) {
  if (!task.due_date) {
    return '未設定';
  }

  return task.is_expired ? `${task.due_date}（期限切れ）` : task.due_date;
}

export function formatTaskCount(totalCount: number, page: number, perPage: number) {
  if (totalCount === 0) {
    return '0件';
  }

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);
  return `${start}〜${end}件 / 全${totalCount}件`;
}

export function isFiltering(query: string, status: TaskFilterStatus | 'all') {
  return query.trim().length > 0 || status !== 'all';
}

export function getStatusBadgeClass(task: Task) {
  if (task.is_expired) {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }

  return statusBadgeClasses[task.status];
}

export function getNoticeClassName(tone: NoticeTone) {
  return noticeToneClasses[tone];
}
