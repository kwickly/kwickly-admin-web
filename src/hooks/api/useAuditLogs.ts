import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PaginatedResponse } from './usePlatform';

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

export function useAuditLogs(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['tenant', 'audit-logs', page, limit],
    queryFn: async (): Promise<PaginatedResponse<AuditLog>> => {
      const offset = (page - 1) * limit;
      const { data } = await api.get(`/tenant/audit-logs?limit=${limit}&offset=${offset}`);
      return data;
    },
  });
}
