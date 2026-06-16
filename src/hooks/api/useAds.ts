import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAds() {
  const queryClient = useQueryClient();

  const adsQuery = useQuery({
    queryKey: ['ads'],
    queryFn: async () => {
      const response = await api.get('/v1/ads', {
        headers: { 'x-tenant-id': 'default' } // Mock tenant for now
      });
      return response.data.data;
    }
  });

  const createAdMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/v1/ads', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    }
  });

  return {
    ads: adsQuery.data,
    isLoading: adsQuery.isLoading,
    createAd: createAdMutation.mutateAsync,
    isCreating: createAdMutation.isPending
  };
}
