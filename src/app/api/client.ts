const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta: Record<string, unknown> | null;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    return { success: false, data: null, error: `HTTP ${res.status}`, meta: null };
  }
  return res.json();
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return apiFetch<T>(path);
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}
