import { describe, expect, it } from 'vitest';
import { visualTasks } from './taskBoardVisualData';
import { TASKS_PER_PAGE } from '../../features/tasks/taskBoardFormat';

const forbiddenTerms = ['顧客', 'customer', 'meeting', '受信', 'support', '確認を依頼', '問い合わせ', '申し込み', '決済'];

describe('taskBoardVisualData', () => {
  it('keeps visual seed text free of external contact cues', () => {
    const seedText = visualTasks
      .flatMap((task) => [task.title, task.description, ...task.tag_names])
      .join(' ');

    for (const term of forbiddenTerms) {
      expect(seedText).not.toContain(term);
    }
  });

  it('keeps enough tasks for a paginated screenshot', () => {
    expect(visualTasks).toHaveLength(22);
    expect(visualTasks.length).toBeGreaterThanOrEqual(TASKS_PER_PAGE);
    expect(Math.ceil(visualTasks.length / TASKS_PER_PAGE)).toBeGreaterThan(1);
  });
});
