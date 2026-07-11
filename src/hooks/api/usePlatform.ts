import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TenantStats {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  brandColor: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  plan: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  createdAt: string;
  branchCount: number;
  userCount: number;
}

export interface PlatformMetrics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalOrdersProcessed: number;
  platformGMV: number;
  planBreakdown: {
    FREE: number;
    STARTER: number;
    GROWTH: number;
    ENTERPRISE: number;
  };
}

export interface AuditLogItem {
  id: string;
  method: string;
  path: string;
  ipAddress: string | null;
  createdAt: string;
  userName: string;
  userEmail: string;
  tenantName: string;
  userRole?: string;
  statusCode?: number;
  userAgent?: string;
}

// GET /v1/platform/metrics
export function usePlatformMetrics() {
  return useQuery({
    queryKey: ['platform', 'metrics'],
    queryFn: async (): Promise<PlatformMetrics> => {
      const { data } = await api.get('/platform/metrics');
      return data.data;
    },
  });
}

// GET /v1/platform/tenants
export function usePlatformTenants(page: number = 1, limit: number = 12, search: string = '') {
  return useQuery({
    queryKey: ['platform', 'tenants', page, limit, search],
    queryFn: async (): Promise<PaginatedResponse<TenantStats>> => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/platform/tenants?page=${page}&limit=${limit}${searchParam}`);
      return data;
    },
  });
}

// POST /v1/platform/tenants
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      slug: string;
      email?: string;
      phone?: string;
      address?: string;
      plan?: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
      brandColor?: string;
    }) => {
      const { data } = await api.post('/platform/tenants', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'tenants'] });
      queryClient.invalidateQueries({ queryKey: ['platform', 'metrics'] });
    },
  });
}

// PATCH /v1/platform/tenants/:id
export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      plan?: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
      status?: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
    }}) => {
      const { data } = await api.patch(`/platform/tenants/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'tenants'] });
      queryClient.invalidateQueries({ queryKey: ['platform', 'metrics'] });
    },
  });
}

// DELETE /v1/platform/tenants/:id
export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/platform/tenants/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'tenants'] });
      queryClient.invalidateQueries({ queryKey: ['platform', 'metrics'] });
    },
  });
}

// GET /v1/platform/audit-logs
export function usePlatformAuditLogs(page: number = 1, limit: number = 50, search: string = '') {
  return useQuery({
    queryKey: ['platform', 'audit-logs', page, limit, search],
    queryFn: async (): Promise<PaginatedResponse<AuditLogItem>> => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/platform/audit-logs?page=${page}&limit=${limit}${searchParam}`);
      return data;
    },
  });
}
