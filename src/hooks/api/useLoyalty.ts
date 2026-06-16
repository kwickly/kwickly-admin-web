import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface LoyaltyConfig {
  bronzeMultiplier: string;
  silverMultiplier: string;
  goldMultiplier: string;
  pointsPerRupee: string;
  walletTopUpEnabled: boolean;
  partialDeductionAllowed: boolean;
}

export function useLoyaltyConfig() {
  return useQuery({
    queryKey: ['crm', 'loyalty-config'],
    queryFn: async (): Promise<LoyaltyConfig> => {
      const { data } = await api.get('/crm/loyalty/config');
      return data.data;
    },
  });
}

export function useUpdateLoyaltyConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoyaltyConfig) => {
      const { data } = await api.post('/crm/loyalty/config', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'loyalty-config'] });
    },
  });
}
