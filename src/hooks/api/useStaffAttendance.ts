import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface TimesheetRecord {
  id: string;
  staffId: string;
  staffName: string;
  clockIn: string;
  clockOut: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalHours: number;
}

export function useTimesheets() {
  return useQuery({
    queryKey: ['staff', 'timesheets'],
    queryFn: async (): Promise<TimesheetRecord[]> => {
      const { data } = await api.get('/staff/timesheets');
      return data.data;
    },
  });
}

export function useUpdateTimesheet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) => {
      const { data } = await api.patch(`/staff/timesheets/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'timesheets'] });
    },
  });
}

