import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateBranchPayload {
  name?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

// GET /v1/branches
export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async (): Promise<Branch[]> => {
      const { data } = await api.get('/branches');
      return data.data; // Elysia envelope: { success: true, data: [...] }
    },
  });
}

// PATCH /v1/branches/:id
export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateBranchPayload }) => {
      const { data } = await api.patch(`/branches/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}
