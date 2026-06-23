import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SalarySlip {
  id: string;
  tenantId: string;
  payrollRunId: string;
  staffId: string;
  baseAmount: string;
  overtimeAmount: string;
  deductions: string;
  bonus: string;
  netPayable: string;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
  staff?: {
    name: string;
    email: string;
  };
}

export interface PayrollRun {
  id: string;
  tenantId: string;
  periodStartDate: string;
  periodEndDate: string;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
  createdAt: string;
  slips?: SalarySlip[];
}

export function usePayrollRuns() {
  return useQuery({
    queryKey: ['staff', 'payroll'],
    queryFn: async (): Promise<PayrollRun[]> => {
      const { data } = await api.get('/payroll');
      return data.data;
    },
  });
}

export function usePayrollRun(id: string | null) {
  return useQuery({
    queryKey: ['staff', 'payroll', id],
    queryFn: async (): Promise<PayrollRun> => {
      const { data } = await api.get(`/payroll/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useGeneratePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ periodStartDate, periodEndDate }: { periodStartDate: string; periodEndDate: string }) => {
      const { data } = await api.post('/payroll/run', { periodStartDate, periodEndDate });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'payroll'] });
    },
  });
}

export function useUpdateSalarySlip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, bonus, deductions }: { id: string; bonus?: number; deductions?: number }) => {
      const { data } = await api.patch(`/payroll/slips/${id}`, { bonus, deductions });
      return data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific payroll run to refetch slips
      queryClient.invalidateQueries({ queryKey: ['staff', 'payroll'] });
    },
  });
}

export function useAdvancePayrollStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'PROCESSED' | 'PAID' }) => {
      const { data } = await api.patch(`/payroll/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'payroll'] });
    },
  });
}
