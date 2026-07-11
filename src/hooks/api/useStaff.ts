import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  pin: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'ON_LEAVE';
  joiningDate: string;
  salaryType: string;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  isSystem: boolean;
  permissions: string[];
}

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async (): Promise<{ id: string; name: string; slug: string; description: string }[]> => {
      const { data } = await api.get('/staff/permissions');
      return data.data;
    },
  });
}

export function useRoles(enabled: boolean = true) {
  return useQuery({
    queryKey: ['staff', 'roles'],
    queryFn: async (): Promise<Role[]> => {
      const { data } = await api.get('/staff/roles');
      return data.data;
    },
    enabled,
  });
}

// PATCH /v1/staff/roles/:id
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, permissions }: { id: string; permissions: string[] }) => {
      const { data } = await api.patch(`/staff/roles/${id}`, { permissions });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'roles'] });
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { name: string; permissions: string[] }) => {
      const { data } = await api.post('/staff/roles', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'roles'] });
    },
  });
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/staff/roles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'roles'] });
    }
  });
};

export const useDeletePlatformRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/platform/staff/roles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-staff', 'roles'] });
    }
  });
};

export function usePlatformRoles(enabled: boolean = true) {
  return useQuery({
    queryKey: ['platform-staff', 'roles'],
    queryFn: async (): Promise<Role[]> => {
      const { data } = await api.get('/platform/staff/roles');
      return data.data;
    },
    enabled,
  });
}

export function useUpdatePlatformRolePermissions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, permissions }: { id: string; permissions: string[] }) => {
      const { data } = await api.patch(`/platform/staff/roles/${id}`, { permissions });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-staff', 'roles'] });
    },
  });
}

// GET /v1/staff
export function useStaffList(branchId?: string) {
  return useQuery({
    queryKey: ['staff', branchId],
    queryFn: async (): Promise<StaffMember[]> => {
      const url = branchId && branchId !== 'default' ? `/staff?branchId=${branchId}` : '/staff';
      const { data } = await api.get(url);
      return data.data; // Elysia returns { success: true, data: [...] }
    },
  });
}

// POST /v1/staff
export function useCreateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      phone: string;
      role: 'manager' | 'cashier' | 'kitchen_staff' | 'qr_scanner';
      branchId?: string;
      salaryType?: 'HOURLY' | 'MONTHLY';
      baseSalary?: string;
      hourlyRate?: string;
    }) => {
      const { data } = await api.post('/staff', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

// PATCH /v1/staff/:id
export function useUpdateStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, payload }: {
      id: string;
      payload: Partial<{
        name: string;
        phone: string;
        role: 'manager' | 'cashier' | 'kitchen_staff' | 'qr_scanner';
        branchId: string | null;
        status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'ON_LEAVE';
        salaryType: 'HOURLY' | 'MONTHLY';
        baseSalary: string | null;
        hourlyRate: string | null;
      }>;
    }) => {
      const { data } = await api.patch(`/staff/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

// PATCH /v1/staff/:id/pin
export function useUpdateStaffPin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, pin }: { id: string; pin: string }) => {
      const { data } = await api.post(`/staff/${id}/pin`, { pin });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

// DELETE /v1/staff/:id
export function useDeleteStaff() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/staff/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
