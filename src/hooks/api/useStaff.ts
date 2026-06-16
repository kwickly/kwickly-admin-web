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

// GET /v1/staff
export function useStaffList() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async (): Promise<StaffMember[]> => {
      const { data } = await api.get('/staff');
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
    }) => {
      const { data } = await api.post('/staff', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
