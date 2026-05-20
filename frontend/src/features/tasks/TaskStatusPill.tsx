import type { Task } from '../../lib/api';
import { formatTaskStatus, getStatusBadgeClass } from './taskBoardFormat';

type Props = {
  task: Task;
};

export function TaskStatusPill({ task }: Props) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(task)}`}>
      {formatTaskStatus(task)}
    </span>
  );
}
