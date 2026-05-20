import type { NoticeState } from './taskBoardFormat';
import { getNoticeClassName } from './taskBoardFormat';

type Props = {
  notice: NoticeState;
};

export function TaskBoardNotice({ notice }: Props) {
  if (!notice) {
    return null;
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${getNoticeClassName(notice.tone)}`} role="status">
      {notice.message}
    </div>
  );
}
