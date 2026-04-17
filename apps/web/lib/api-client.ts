const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type DumpRequest = {
  raw_input: string;
  input_mode?: "text" | "voice";
  energy_level?: string;
  available_minutes?: number;
};

export type DumpResponse = {
  brain_dump_id: string;
  processing_status: string;
  clarifications_required: boolean;
  clarifications: Array<{ question: string }>;
  provisional_tasks: Array<{ title: string; category: string }>;
  next_action: string;
};

export type Task = {
  id: string;
  user_id: string | null;
  title: string;
  description?: string | null;
  status: "active" | "cooling" | "in_progress" | "done" | "blocked" | "delayed" | "deep_freeze";
  category?: "do_now" | "do_today" | "schedule_later" | "let_go" | null;
  urgency_score: number;
  impact_score: number;
  effort_score: number;
  priority_score: number;
  avoidance_count: number;
  is_pinned: boolean;
  source_brain_dump_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type PlanItem = {
  id: string;
  title: string;
  why_selected: string;
  first_step: string;
  estimated_minutes: number;
  priority_score: number;
};

export type PlanResponse = {
  plan_id?: string;
  brutal_three: PlanItem[];
  reasoning_summary: string;
  estimated_total_minutes: number;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function createDump(payload: DumpRequest): Promise<DumpResponse> {
  return apiFetch<DumpResponse>("/v1/dumps", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createTask(payload: {
  user_id: string;
  title: string;
  description?: string;
  status?: Task["status"];
  category?: Task["category"];
  urgency_score?: number;
  impact_score?: number;
  effort_score?: number;
  source_brain_dump_id?: string;
  is_pinned?: boolean;
}): Promise<Task> {
  return apiFetch<Task>("/v1/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getTasks(userId: string, status?: string): Promise<{ tasks: Task[]; count: number }> {
  const params = new URLSearchParams({ user_id: userId });
  if (status) params.set("status", status);

  return apiFetch<{ tasks: Task[]; count: number }>(`/v1/tasks?${params.toString()}`);
}

export async function updateTask(taskId: string, payload: Partial<Task>): Promise<Task> {
  return apiFetch<Task>(`/v1/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function recordTaskEvent(
  taskId: string,
  eventType: "started" | "done" | "delayed" | "blocked" | "restored",
  metadata: Record<string, unknown> = {},
): Promise<{ task_id: string; event_type: string; task: Task }> {
  return apiFetch<{ task_id: string; event_type: string; task: Task }>(`/v1/tasks/${taskId}/events`, {
    method: "POST",
    body: JSON.stringify({ event_type: eventType, metadata }),
  });
}

export async function generatePlan(userId: string): Promise<PlanResponse> {
  const params = new URLSearchParams({ user_id: userId });

  return apiFetch<PlanResponse>(`/v1/plans/generate?${params.toString()}`, {
    method: "POST",
  });
}

export async function completeTask(taskId: string, sentiment?: "easy" | "expected" | "grind"):
  Promise<{ task_id: string; status: string; updated_effort_score: number }> {
  return apiFetch(`/v1/tasks/${taskId}/complete`, {
    method: "POST",
    body: JSON.stringify({ sentiment }),
  });
}

export async function createReflection(payload: {
  task_id: string;
  sentiment: "easy" | "expected" | "grind";
}): Promise<{ task_id: string; sentiment: string; updated_effort_score: number; message: string }> {
  return apiFetch(`/v1/reflections`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resolveStuckStep(payload: {
  taskId: string;
  friction_note: string;
  current_first_step: string;
  repo_context?: {
    repo_name?: string;
    readme_summary?: string;
    structure?: string[];
  };
}): Promise<{ task_id: string; updated_first_step: string; reason: string }> {
  const { taskId, ...body } = payload;

  return apiFetch(`/v1/tasks/${taskId}/stuck`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
