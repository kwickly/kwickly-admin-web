import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  type: string;
  mode?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  tableNumber?: string;
  subtotal: string;
  total: string;
  items: OrderItem[];
}

export interface ActiveKOT {
  id: string;
  orderId: string;
  status: string;
  priority: number;
  tableNumber?: string;
  orderMode?: string;
  kotRound?: number;
  items: any; // JSON
  createdAt: string;
  updatedAt: string;
}

// GET /v1/orders
export function useOrders(branchId: string, paymentStatus?: string) {
  return useQuery({
    queryKey: ['orders', branchId, paymentStatus],
    queryFn: async (): Promise<Order[]> => {
      const { data } = await api.get('/orders', {
        params: { branchId, limit: '50', paymentStatus }
      });
      return data.data; // Cursor pagination returns { success: true, data: [...], meta: {...} }
    },
    enabled: !!branchId,
    refetchInterval: 5000, 
    staleTime: 0, 
  });
}

// GET /v1/orders/kots/active
export function useActiveKOTs(branchId: string) {
  return useQuery({
    queryKey: ['kots', 'active', branchId],
    queryFn: async (): Promise<ActiveKOT[]> => {
      const { data } = await api.get('/orders/kots/active', {
        params: { branchId }
      });
      return data.data; // { success: true, data: [...] }
    },
    enabled: !!branchId,
    staleTime: Infinity, // WebSocket will invalidate it
  });
}

export function useUpdateKOTStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ kotId, status }: { kotId: string, status: string }) => {
      const { data } = await api.patch(`/orders/kots/${kotId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kots'] });
    }
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, paymentStatus, paymentMethod }: { orderId: string, paymentStatus: string, paymentMethod?: string }) => {
      const { data } = await api.patch(`/orders/${orderId}/payment`, { paymentStatus, paymentMethod });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}

export function useUpdateOrderItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, items }: { orderId: string, items: { menuItemId: string, quantity: number }[] }) => {
      const { data } = await api.patch(`/orders/${orderId}/items`, { items });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['kots'] });
    }
  });
}
