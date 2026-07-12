import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Device {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  type: 'POS' | 'KDS';
  pairingCode: string | null;
  pairingCodeExpiresAt: string | null;
  status: 'active' | 'offline' | 'revoked';
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: async (): Promise<Device[]> => {
      const { data } = await api.get(`/devices`);
      return data;
    },
  });
}

export function useRegisterDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { branchId: string; name: string; type: 'POS' | 'KDS' }) => {
      const { data } = await api.post('/devices', payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices', variables.branchId] });
    },
  });
}

export function useRevokeDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string; branchId: string }) => {
      const { data } = await api.patch(`/devices/${id}/revoke`);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices', variables.branchId] });
    },
  });
}
