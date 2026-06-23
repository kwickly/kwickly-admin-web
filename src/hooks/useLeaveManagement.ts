import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface PublicHoliday {
  id: string;
  name: string;
  date: string;
  tenantId: string;
}

export interface StaffLeave {
  id: string;
  staffId: string;
  leaveType: 'SICK' | 'VACATION' | 'UNPAID';
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  staff?: {
    name: string;
    email: string;
  };
}

export function usePublicHolidays() {
  return useQuery({
    queryKey: ['publicHolidays'],
    queryFn: async () => {
      const res = await api.get('/leave/holidays');
      return res.data.data as PublicHoliday[];
    },
  });
}

export function useDeclareHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; date: string }) => {
      const res = await api.post('/leave/holidays', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicHolidays'] });
    },
  });
}

export function useRemoveHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/leave/holidays/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicHolidays'] });
    },
  });
}

export function useLeaves() {
  return useQuery({
    queryKey: ['staffLeaves'],
    queryFn: async () => {
      const res = await api.get('/leave');
      return res.data.data as StaffLeave[];
    },
  });
}

export function useRequestLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { leaveType: string; startDate: string; endDate: string }) => {
      const res = await api.post('/leave', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffLeaves'] });
    },
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) => {
      const res = await api.patch(`/leave/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffLeaves'] });
    },
  });
}
