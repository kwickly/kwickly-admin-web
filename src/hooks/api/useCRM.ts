import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Segment {
  id: string;
  name: string;
  ruleType: string;
  ruleValue: string;
  customerCount: number;
}

export interface Campaign {
  id: string;
  title: string;
  channel: 'whatsapp' | 'push' | 'email' | 'sms';
  status: 'SENT' | 'SCHEDULED' | 'FAILED';
  sentCount: number;
  sentAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isActive: boolean;
}

export function useSegments() {
  return useQuery({
    queryKey: ['crm', 'segments'],
    queryFn: async (): Promise<Segment[]> => {
      const { data } = await api.get('/crm/segments');
      return data.data;
    },
  });
}

export function useCreateSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; ruleType: string; ruleValue: string }) => {
      const { data } = await api.post('/crm/segments', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'segments'] });
    },
  });
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['crm', 'campaigns'],
    queryFn: async (): Promise<Campaign[]> => {
      const { data } = await api.get('/crm/campaigns');
      return data.data;
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; segmentId: string; channel: string; message: string }) => {
      const { data } = await api.post('/crm/campaigns', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'campaigns'] });
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ['crm', 'customers'],
    queryFn: async (): Promise<Customer[]> => {
      const { data } = await api.get('/crm/customers');
      return data.data;
    },
  });
}
