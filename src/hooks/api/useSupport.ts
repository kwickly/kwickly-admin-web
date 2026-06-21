import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useSupport = () => {
  const queryClient = useQueryClient();

  const useTenantTickets = () => {
    return useQuery({
      queryKey: ['support_tickets', 'tenant'],
      queryFn: async () => {
        const { data } = await api.get('/v1/support/tickets');
        return data.data;
      },
    });
  };

  const usePlatformTickets = () => {
    return useQuery({
      queryKey: ['support_tickets', 'platform'],
      queryFn: async () => {
        const { data } = await api.get('/v1/platform/support/tickets');
        return data.data;
      },
    });
  };

  const useTicketDetails = (ticketId: string, isPlatform: boolean = false) => {
    return useQuery({
      queryKey: ['support_tickets', ticketId],
      queryFn: async () => {
        const url = isPlatform 
          ? `/v1/platform/support/tickets/${ticketId}`
          : `/v1/support/tickets/${ticketId}`;
        const { data } = await api.get(url);
        return data.data;
      },
      enabled: !!ticketId,
    });
  };

  const useCreateTicket = () => {
    return useMutation({
      mutationFn: async (payload: { subject: string; description: string; priority: string; category: string }) => {
        const { data } = await api.post('/v1/support/tickets', payload);
        return data.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['support_tickets', 'tenant'] });
      },
    });
  };

  const useAddMessage = (isPlatform: boolean = false) => {
    return useMutation({
      mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
        const url = isPlatform 
          ? `/v1/platform/support/tickets/${ticketId}/messages`
          : `/v1/support/tickets/${ticketId}/messages`;
        const { data } = await api.post(url, { message });
        return data.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['support_tickets', variables.ticketId] });
        queryClient.invalidateQueries({ queryKey: ['support_tickets'] });
      },
    });
  };

  const useUpdateTicketStatus = () => {
    return useMutation({
      mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
        const { data } = await api.patch(`/v1/platform/support/tickets/${ticketId}/status`, { status });
        return data.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['support_tickets', variables.ticketId] });
        queryClient.invalidateQueries({ queryKey: ['support_tickets', 'platform'] });
      },
    });
  };

  return {
    useTenantTickets,
    usePlatformTickets,
    useTicketDetails,
    useCreateTicket,
    useAddMessage,
    useUpdateTicketStatus,
  };
};
