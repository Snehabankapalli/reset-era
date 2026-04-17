const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function createDump(payload: {
  raw_input: string;
  energy_level?: string;
  available_minutes?: number;
}) {
  return request("/v1/dumps", {
    method: "POST",
    body: JSON.stringify({ ...payload, input_mode: "text" }),
  });
}

export function generatePlan() {
  return request("/v1/plans/generate", { method: "POST" });
}

export function getTodayPlan() {
  return request("/v1/plans/today");
}
