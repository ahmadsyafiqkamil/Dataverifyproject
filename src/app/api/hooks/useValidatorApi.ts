import { useState, useEffect } from "react";
import { apiGet, apiPost, type ApiResponse } from "../client";

export function useValidatorStats() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/validator/dashboard/stats")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useValidatorPending() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/validator/pending")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useValidatorReviews() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>>("/api/validator/reviews")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useValidatorConsensus() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>[]>("/api/validator/consensus")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useValidatorEarnings() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, unknown>>("/api/validator/earnings")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export async function triggerEvaluation(evalId: string): Promise<ApiResponse<Record<string, unknown>>> {
  return apiPost(`/api/validator/pending/${evalId}/evaluate`);
}
