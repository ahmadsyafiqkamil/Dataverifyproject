import { useState, useEffect } from "react";
import { apiGet } from "../client";

export function useNetworkStatus() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, string>>("/api/network/status")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useMinerNetworkStatus() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, string>>("/api/network/miner-status")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useValidatorNetworkStatus() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Record<string, string>>("/api/network/validator-status")
      .then((r) => { if (r.success) setData(r.data); })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
