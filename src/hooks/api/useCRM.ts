import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PaginatedResponse } from './usePlatform';

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
  walletBalance: string;
  lifetimeValue: string;
  marketingOptIn: boolean;
  loyaltyPoints: string;
}

export interface WalletTransaction {
  id: string;
  amount: string;
  type: 'CREDIT' | 'DEBIT';
  reason: string;
  createdAt: string;
}

export interface LoyaltyLedger {
  id: string;
  points: string;
  reason: string;
  createdAt: string;
}

export interface CustomerProfileDetails {
  id: string;
  userId: string;
  dateOfBirth?: string;
  anniversaryDate?: string;
  marketingOptIn: boolean;
  walletBalance: string;
  lifetimeValue: string;
  loyaltyPointsBalance: string;
  walletTransactions: WalletTransaction[];
  loyaltyLedgers: LoyaltyLedger[];
}

export function useSegments(page: number = 1, limit: number = 12, search: string = '') {
  return useQuery({
    queryKey: ['crm', 'segments', page, limit, search],
    queryFn: async (): Promise<PaginatedResponse<Segment>> => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/crm/segments?page=${page}&limit=${limit}${searchParam}`);
      return data;
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

export function useCampaigns(page: number = 1, limit: number = 50, search: string = '') {
  return useQuery({
    queryKey: ['crm', 'campaigns', page, limit, search],
    queryFn: async (): Promise<PaginatedResponse<Campaign>> => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/crm/campaigns?page=${page}&limit=${limit}${searchParam}`);
      return data;
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

export function useCustomers(page: number = 1, limit: number = 50) {
  return useQuery({
    queryKey: ['crm', 'customers', page, limit],
    queryFn: async (): Promise<PaginatedResponse<Customer>> => {
      const { data } = await api.get(`/crm/customers?page=${page}&limit=${limit}`);
      return data;
    },
  });
}

export function useCustomerProfile(id: string) {
  return useQuery({
    queryKey: ['crm', 'customers', id],
    queryFn: async (): Promise<CustomerProfileDetails> => {
      const { data } = await api.get(`/crm/customers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useAdjustWallet(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { amount: string; type: 'CREDIT' | 'DEBIT'; reason: string }) => {
      const { data } = await api.post(`/crm/customers/${id}/wallet`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers', id] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers'] });
    },
  });
}

export function useAdjustLoyalty(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { points: string; reason: string }) => {
      const { data } = await api.post(`/crm/customers/${id}/loyalty`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers', id] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customers'] });
    },
  });
}
