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

export interface RevenueTrendPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface HourlySalesPoint {
  hour: number;
  label: string;
  revenue: number;
  orders: number;
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
        params: { branchId, limit: '10' }
      });
      return data.data;
    },
    enabled: !!branchId,
  });
}

// GET /v1/analytics/weekly-revenue?branchId=...&days=30
export function useRevenueTrend(branchId: string, days: number = 30) {
  return useQuery({
    queryKey: ['analytics', 'weekly-revenue', branchId, days],
    queryFn: async (): Promise<RevenueTrendPoint[]> => {
      const { data } = await api.get('/analytics/weekly-revenue', {
        params: { branchId, days: days.toString() }
      });
      return data.data;
    },
    enabled: !!branchId,
  });
}

// GET /v1/analytics/hourly-sales?branchId=...&days=7
export function useHourlySales(branchId: string, days: number = 7) {
  return useQuery({
    queryKey: ['analytics', 'hourly-sales', branchId, days],
    queryFn: async (): Promise<HourlySalesPoint[]> => {
      const { data } = await api.get('/analytics/hourly-sales', {
        params: { branchId, days: days.toString() }
      });
      return data.data;
    },
    enabled: !!branchId,
  });
}
