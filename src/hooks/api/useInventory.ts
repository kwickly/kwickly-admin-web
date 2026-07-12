import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface RawMaterial {
  id: string;
  name: string;
  uom: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  taxId?: string;
}

export interface StockItem {
  id: string;
  name: string;
  uom: string;
  currentStock: number;
}

export function useInventoryMaterials() {
  return useQuery({
    queryKey: ['inventory', 'materials'],
    queryFn: async (): Promise<RawMaterial[]> => {
      const { data } = await api.get('/inventory/materials');
      return data.data;
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; uom: string }) => {
      const { data } = await api.post('/inventory/materials', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'materials'] });
    },
  });
}

export function useInventoryStock(branchId: string | null) {
  return useQuery({
    queryKey: ['inventory', 'stock', branchId],
    queryFn: async (): Promise<StockItem[]> => {
      if (!branchId) return [];
      const { data } = await api.get(`/inventory/stock/${branchId}`);
      return data.data;
    },
    enabled: !!branchId,
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { branchId: string; rawMaterialId: string; quantityChange: string; reason: string }) => {
      const { data } = await api.post('/inventory/stock/adjust', payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stock', variables.branchId] });
    },
  });
}

export function useSuppliers() {
  return useQuery({
    queryKey: ['inventory', 'suppliers'],
    queryFn: async (): Promise<Supplier[]> => {
      const { data } = await api.get('/inventory/suppliers');
      return data;
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Supplier>) => {
      const { data } = await api.post('/inventory/suppliers', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'suppliers'] });
    },
  });
}
