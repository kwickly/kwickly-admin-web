import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface CustomerSubscription {
  id: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'exhausted';
  totalMeals: number;
  balanceRemaining: number;
  startsAt: string;
  expiresAt: string;
  autoRenew: boolean;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    mealType: string;
  };
}

export function useCustomerSubscriptions() {
  const [data, setData] = useState<CustomerSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions/customers');
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const updateStatus = async (id: string, status: 'active' | 'paused' | 'cancelled') => {
    try {
      await api.patch(`/subscriptions/customers/${id}/status`, { status });
      await fetchSubscriptions();
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  };

  return { data, loading, error, refetch: fetchSubscriptions, updateStatus };
}
