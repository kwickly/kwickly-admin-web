import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  mealType: 'lunch' | 'dinner' | 'both';
  planType: 'meal_count' | 'monthly' | 'custom';
  totalMeals: number;
  validityDays: number;
  price: string;
  carryForward: boolean;
  allowHoliday: boolean;
  isActive: boolean;
  createdAt?: string;
}

// GET /v1/subscriptions/plans
export function useSubscriptionPlans(branchId?: string) {
  return useQuery({
    queryKey: ['subscriptions', 'plans', branchId],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      const { data } = await api.get('/subscriptions/plans', {
        params: { branchId },
      });
      return data.data;
    },
  });
}

// POST /v1/subscriptions/plans
export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      description?: string;
      mealType: 'lunch' | 'dinner' | 'both';
      planType: 'meal_count' | 'monthly' | 'custom';
      totalMeals: number;
      validityDays: number;
      price: string;
      branchId?: string;
      carryForward?: boolean;
      allowHoliday?: boolean;
    }) => {
      const { data } = await api.post('/subscriptions/plans', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}
