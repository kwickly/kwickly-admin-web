import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Table {
  id: string;
  name: string;
  capacity?: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  sortOrder?: number;
  qrToken: string;
  branchId: string;
}

export function useTables(branchId: string | null) {
  return useQuery({
    queryKey: ['tables', branchId],
    queryFn: async () => {
      const res = await api.get('/tables', { params: { branchId } });
      return res.data?.data as Table[] || [];
    },
    enabled: !!branchId,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { branchId: string; name: string; capacity?: number }) => {
      const res = await api.post('/tables', data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tables', variables.branchId] });
      toast.success('Table created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create table');
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      id: string; 
      branchId: string; 
      name?: string; 
      capacity?: number; 
      status?: 'available' | 'occupied' | 'reserved' | 'cleaning';
      sortOrder?: number;
    }) => {
      const { id, branchId, ...payload } = data;
      const res = await api.patch(`/tables/${id}`, { branchId, ...payload });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tables', variables.branchId] });
      toast.success('Table updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update table');
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; branchId: string }) => {
      const res = await api.delete(`/tables/${data.id}`, { params: { branchId: data.branchId } });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tables', variables.branchId] });
      toast.success('Table deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete table');
    },
  });
}

export function useRegenerateQr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; branchId: string }) => {
      const res = await api.post(`/tables/${data.id}/regenerate-qr`, { branchId: data.branchId });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tables', variables.branchId] });
      toast.success('QR Code regenerated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to regenerate QR code');
    },
  });
}
