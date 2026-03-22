import { useState, useEffect } from "react";
import { apiGet, apiPost, type ApiResponse } from "../client";

export function useMinerStats() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, string>>("/api/miner/dashboard/stats")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useMinerSubmissions() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/miner/submissions")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useMinerRequests() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/miner/requests")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useMinerEarnings() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>>("/api/miner/earnings")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export async function submitDataset(form: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> {
  return apiPost("/api/miner/submissions", form);
}
