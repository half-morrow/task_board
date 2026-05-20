import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Task } from '../../lib/api';
import { TaskStatusPill } from './TaskStatusPill';

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Sample task',
    description: null,
    status: 'todo',
    is_expired: false,
    due_date: null,
    tags: [],
    created_at: '2026-05-21T12:00:00.000Z',
    updated_at: '2026-05-21T12:00:00.000Z',
    ...overrides,
  };
}

describe('TaskStatusPill', () => {
  it('renders a normal status label', () => {
    render(<TaskStatusPill task={buildTask({ status: 'in_progress' })} />);

    expect(screen.getByText('進行中')).toBeInTheDocument();
  });

  it('renders expired tasks with the overdue suffix', () => {
    render(<TaskStatusPill task={buildTask({ is_expired: true })} />);

    expect(screen.getByText('未着手 / 期限切れ')).toBeInTheDocument();
  });
});
