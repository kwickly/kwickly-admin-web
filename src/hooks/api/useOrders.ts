import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface OrderItem {
  name: string;
  quantity: number;
  total: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  type: string;
  subtotal: string;
  total: string;
  items: OrderItem[];
}

// GET /v1/orders
export function useOrders(branchId: string) {
  return useQuery({
    queryKey: ['orders', branchId],
    queryFn: async (): Promise<Order[]> => {
      const { data } = await api.get('/orders', {
        params: { branchId, limit: '50' }
      });
      return data.data; // Cursor pagination returns { success: true, data: [...], meta: {...} }
    },
    enabled: !!branchId,
    refetchInterval: 5000, // Poll every 5s for live KDS updates until WebSockets are ready
  });
}

// In the future, we could add useAdvanceOrderStage() using a PATCH /v1/orders/:id/status
