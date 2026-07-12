import React, { useState } from 'react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuth';
import { format } from 'date-fns';
import { PaginationControls } from '@/components/ui/pagination-controls';
import {
  useLeaves,
  useRequestLeave,
  useUpdateLeaveStatus
} from '../../hooks/useLeaveManagement';

export default function StaffLeaves() {
  const user = useAuthStore((state) => state.user);
  
  // Queries
  const { data: leaves, isLoading: loadingLeaves } = useLeaves();

  // Mutations
  const requestLeaveMut = useRequestLeave();
  const updateLeaveMut = useUpdateLeaveStatus();

  // State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({ leaveType: 'VACATION', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil((leaves?.length || 0) / pageSize);
  const paginatedLeaves = (leaves || []).slice((page - 1) * pageSize, page * pageSize);

  const isManager = user?.roleDetails?.permissions?.includes('attendance:manage') || 
                    user?.role === 'platform_owner' || user?.role === 'tenant_owner' || user?.role === 'super_admin';

  const handleRequestLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestLeaveMut.mutateAsync(newLeave);
    setIsLeaveModalOpen(false);
    setNewLeave({ leaveType: 'VACATION', startDate: '', endDate: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Staff Leaves
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage staff leaves and track automated payroll deductions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <CalendarDays className="h-4 w-4" />
            Request Leave
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                {isManager && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loadingLeaves ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : leaves?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No leave requests found.</td>
                </tr>
              ) : (
                paginatedLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {leave.staff?.name || 'You'}
                      </div>
                      {leave.staff?.email && (
                        <div className="text-xs text-muted-foreground">{leave.staff.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        leave.leaveType === 'VACATION' ? 'bg-info/10 text-info' :
                        leave.leaveType === 'SICK' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-foreground'
                      }`}>
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(leave.startDate), 'MMM d, yyyy')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        leave.status === 'APPROVED' ? 'bg-success/10 border-success/20 text-success' :
                        leave.status === 'REJECTED' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                        'bg-warning/10 border-warning/20 text-warning'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    {isManager && (
                      <td className="px-6 py-4 text-right">
                        {leave.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateLeaveMut.mutate({ id: leave.id, status: 'APPROVED' })}
                              disabled={updateLeaveMut.isPending}
                              className="p-1.5 text-success hover:bg-success/10 rounded transition-colors"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => updateLeaveMut.mutate({ id: leave.id, status: 'REJECTED' })}
                              disabled={updateLeaveMut.isPending}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border">
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95">
          <div className="bg-card w-full max-w-md rounded-xl shadow-sm overflow-hidden border border-border">
            <form onSubmit={handleRequestLeave}>
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Request Leave</h3>
                <p className="text-sm text-muted-foreground mt-1">Submit a new leave request for approval.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Leave Type
                  </label>
                  <select
                    required
                    value={newLeave.leaveType}
                    onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="VACATION">Vacation (Paid)</option>
                    <option value="SICK">Sick Leave (Paid)</option>
                    <option value="UNPAID">Unpaid Leave</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: If your paid leave limits are exceeded, this may automatically convert to unpaid leave.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.endDate}
                      min={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-muted/50 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestLeaveMut.isPending}
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
