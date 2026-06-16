import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ForecastPoint {
  date: string;
  actual: number | null;
  forecast: number;
}

export interface SuggestedCombo {
  id: string;
  name: string;
  items: string[];
  recommendedPrice: string;
  confidence: string;
  lift: string;
}

export interface ChurnCustomer {
  id: string;
  name: string;
  phone: string;
  lastScanAt: string;
  riskScore: string;
  totalVisits: number;
}

export function useAIForecast() {
  return useQuery({
    queryKey: ['analytics', 'ai-forecast'],
    queryFn: async (): Promise<ForecastPoint[]> => {
      const { data } = await api.get('/analytics/ai-forecast');
      return data.data;
    },
  });
}

export function useAICombos() {
  return useQuery({
    queryKey: ['analytics', 'ai-combos'],
    queryFn: async (): Promise<SuggestedCombo[]> => {
      const { data } = await api.get('/analytics/ai-combos');
      return data.data;
    },
  });
}

export function useChurnList() {
  return useQuery({
    queryKey: ['crm', 'churn-prevention'],
    queryFn: async (): Promise<ChurnCustomer[]> => {
      const { data } = await api.get('/crm/churn-prevention');
      return data.data;
    },
  });
}
