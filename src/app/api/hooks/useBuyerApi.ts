import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, type ApiResponse } from "../client";

export function useBuyerStats() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/buyer/dashboard/stats")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

interface DatasetListParams {
  domain?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export function useDatasets(params: DatasetListParams = {}) {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDatasets = useCallback((p: DatasetListParams) => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (p.domain) qs.set("domain", p.domain);
    if (p.search) qs.set("search", p.search);
    if (p.sortBy) qs.set("sortBy", p.sortBy);
    if (p.sortOrder) qs.set("sortOrder", p.sortOrder);
    if (p.page) qs.set("page", String(p.page));
    if (p.limit) qs.set("limit", String(p.limit));
    const q = qs.toString();
    apiGet<Record<string, unknown>[]>(`/api/buyer/datasets${q ? `?${q}` : ""}`)
      .then((r) => {
        if (r.success) { setData(r.data); setMeta(r.meta); }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDatasets(params); }, []); // initial load

  return { data, meta, loading, refetch: fetchDatasets };
}

export function useDatasetDetail(id: number) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>>(`/api/buyer/datasets/${id}`)
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}

export function useBuyerActivity() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/buyer/activity")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function usePurchaseHistory() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>>("/api/buyer/history")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useBuyerRequests() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/buyer/requests")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export async function purchaseDataset(id: number): Promise<ApiResponse<Record<string, unknown>>> {
  return apiPost(`/api/buyer/datasets/${id}/purchase`);
}
