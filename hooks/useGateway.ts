import { useState, useEffect, useCallback } from 'react';
import * as gateway from '../api/gateway';

export function useSessions(refreshMs = 5000) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await gateway.listSessions();
      setSessions(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, refreshMs);
    return () => clearInterval(interval);
  }, [fetch, refreshMs]);

  return { sessions, loading, error, refetch: fetch };
}

export function useGatewayStatus(refreshMs = 5000) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await gateway.gatewayStatus();
      setStatus(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, refreshMs);
    return () => clearInterval(interval);
  }, [fetch, refreshMs]);

  return { status, loading, error, refetch: fetch };
}

export function useConfig(path?: string) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await gateway.getConfig(path);
      setConfig(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const save = useCallback(async (newConfig: any) => {
    try {
      await gateway.patchConfig(newConfig);
      setConfig(newConfig);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  }, []);

  return { config, loading, error, refetch: fetch, save };
}
