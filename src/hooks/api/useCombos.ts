import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ComboItem {
  menuItemId: string;
  quantity: number;
}

export interface Combo {
  id: string;
  name: string;
  description: string | null;
  price: string;
  isActive: boolean;
}

// GET /v1/combos
export function useCombos(branchId?: string) {
  return useQuery({
    queryKey: ['combos', branchId],
    queryFn: async (): Promise<Combo[]> => {
      const { data } = await api.get('/combos', {
        params: { branchId }
      });
      return data.data; 
    },
  });
}

// POST /v1/combos
export function useCreateCombo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      description?: string;
      price: string;
      items: ComboItem[];
      branchId?: string;
    }) => {
      const { data } = await api.post('/combos', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] });
    },
  });
}
