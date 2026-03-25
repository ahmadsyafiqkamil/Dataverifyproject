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
  const token = localStorage.getItem("dv_token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  // 401 on non-auth endpoints → clear token and redirect to login
  if (res.status === 401 && !path.startsWith("/api/auth/")) {
    localStorage.removeItem("dv_token");
    window.location.href = "/login";
    return { success: false, data: null, error: "Unauthorized", meta: null };
  }

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
