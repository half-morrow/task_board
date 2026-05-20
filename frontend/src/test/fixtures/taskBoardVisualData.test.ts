import { describe, expect, it } from 'vitest';
import { visualTasks } from './taskBoardVisualData';

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
});
