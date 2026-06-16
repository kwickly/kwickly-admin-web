import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DailySales {
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
}

export interface TopItem {
  name: string;
  quantitySold: number;
  revenue: number;
}

// GET /v1/analytics/sales
export function useDailySales(branchId: string, date: string) {
  return useQuery({
    queryKey: ['analytics', 'sales', branchId, date],
    queryFn: async (): Promise<DailySales> => {
      const { data } = await api.get('/analytics/sales', {
        params: { branchId, date }
      });
      return data.data;
    },
    enabled: !!branchId,
  });
}

// GET /v1/analytics/top-items
export function useTopItems(branchId: string) {
  return useQuery({
    queryKey: ['analytics', 'top-items', branchId],
    queryFn: async (): Promise<TopItem[]> => {
      const { data } = await api.get('/analytics/top-items', {
        params: { branchId, limit: '5' }
      });
      return data.data;
    },
    enabled: !!branchId,
  });
}
