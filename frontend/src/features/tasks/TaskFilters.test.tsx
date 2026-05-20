import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskFilters } from './TaskFilters';
import type { TaskFilterStatus } from '../../lib/api';

describe('TaskFilters', () => {
  it('describes only the supported filter fields', () => {
    render(
      <TaskFilters
        query=""
        status="all"
        hasActiveFilters={false}
        onChangeQuery={vi.fn()}
        onChangeStatus={vi.fn() as (value: TaskFilterStatus | 'all') => void}
        onClearFilters={vi.fn()}
      />,
    );

    expect(screen.getByText('検索とステータスで一覧を絞り込めます。')).toBeInTheDocument();
    expect(screen.queryByText('検索、ステータス、期限で一覧を絞り込めます。')).not.toBeInTheDocument();
  });
});
