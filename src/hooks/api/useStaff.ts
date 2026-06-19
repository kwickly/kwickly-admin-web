import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  pin: string | null;
  isActive: boolean;
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

// GET /v1/staff/roles
export function useRoles() {
  return useQuery({
    queryKey: ['staff', 'roles'],
    queryFn: async (): Promise<Role[]> => {
      const { data } = await api.get('/staff/roles');
      return data.data;
    },
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
        isActive: boolean;
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
