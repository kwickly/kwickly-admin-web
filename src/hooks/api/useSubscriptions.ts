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
export function useSubscriptionPlans(branchId?: string, includeInactive?: boolean) {
  return useQuery({
    queryKey: ['subscriptions', 'plans', branchId, includeInactive],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      const { data } = await api.get('/subscriptions/plans', {
        params: { branchId, includeInactive },
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

// PATCH /v1/subscriptions/plans/:id
export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: {
      id: string;
      payload: Partial<{
        name: string;
        description: string | null;
        mealType: 'lunch' | 'dinner' | 'both';
        planType: 'meal_count' | 'monthly' | 'custom';
        totalMeals: number;
        validityDays: number;
        price: string;
        branchId: string | null;
        carryForward: boolean;
        allowHoliday: boolean;
        isActive: boolean;
      }>;
    }) => {
      const { data } = await api.patch(`/subscriptions/plans/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

// DELETE /v1/subscriptions/plans/:id
export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/subscriptions/plans/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}
