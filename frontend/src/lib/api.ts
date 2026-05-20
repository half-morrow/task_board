export type Status = 'todo' | 'in_progress' | 'done';
export type TaskFilterStatus = Status | 'expired';

export type User = {
  id: number;
  username: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: Status;
  is_expired: boolean;
  due_date: string | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
};

export type PageMeta = {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export type TaskInput = {
  title: string;
  description: string;
  status: Status;
  due_date: string;
  tag_names: string[];
};

const jsonHeaders = { 'Content-Type': 'application/json' };
const defaultErrorMessage = 'リクエストに失敗しました';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

export function buildApiUrl(path: string, baseUrl: string = apiBaseUrl) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  return normalizedBaseUrl ? `${normalizedBaseUrl}${path}` : path;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      credentials: 'include',
      headers: init.body ? jsonHeaders : undefined,
      ...init,
    });
  } catch {
    throw new Error(defaultErrorMessage);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new Error(body?.error?.message ?? defaultErrorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  register(username: string, password: string) {
    return request<{ data: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  login(username: string, password: string) {
    return request<{ data: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  logout() {
    return request<void>('/api/v1/auth/logout', { method: 'DELETE' });
  },
  me() {
    return request<{ data: User }>('/api/v1/auth/me');
  },
  tasks(params: URLSearchParams) {
    return request<{ data: Task[]; meta: PageMeta }>(`/api/v1/tasks?${params.toString()}`);
  },
  createTask(input: TaskInput) {
    return request<{ data: Task }>('/api/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateTask(id: number, input: TaskInput) {
    return request<{ data: Task }>(`/api/v1/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  deleteTask(id: number) {
    return request<void>(`/api/v1/tasks/${id}`, { method: 'DELETE' });
  },
};
