import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface AuditLog {
  id: string;
  method: string;
  path: string;
  ipAddress: string | null;
  userAgent: string | null;
  statusCode: number;
  createdAt: string;
  userRole: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function useAuditLogs() {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (limit: number = 50, offset: number = 0) => {
    try {
      setLoading(true);
      const response = await api.get(`/tenant/audit-logs?limit=${limit}&offset=${offset}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { data, loading, error, refetch: fetchLogs };
}
