import React, { useState } from 'react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuth';
import { format } from 'date-fns';
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Staff Leaves
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage staff leaves and track automated payroll deductions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <CalendarDays className="h-4 w-4" />
            Request Leave
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-400">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 font-medium border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                {isManager && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {loadingLeaves ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : leaves?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No leave requests found.</td>
                </tr>
              ) : (
                leaves?.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {leave.staff?.name || 'You'}
                      </div>
                      {leave.staff?.email && (
                        <div className="text-xs text-slate-500 dark:text-zinc-500">{leave.staff.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        leave.leaveType === 'VACATION' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                        leave.leaveType === 'SICK' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' :
                        'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(leave.startDate), 'MMM d, yyyy')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        leave.status === 'APPROVED' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400' :
                        leave.status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' :
                        'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-400'
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
                              className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-500 dark:hover:bg-green-500/10 rounded transition-colors"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => updateLeaveMut.mutate({ id: leave.id, status: 'REJECTED' })}
                              disabled={updateLeaveMut.isPending}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-500/10 rounded transition-colors"
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
      </div>

      {/* Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
            <form onSubmit={handleRequestLeave}>
              <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Request Leave</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Submit a new leave request for approval.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Leave Type
                  </label>
                  <select
                    required
                    value={newLeave.leaveType}
                    onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  >
                    <option value="VACATION">Vacation (Paid)</option>
                    <option value="SICK">Sick Leave (Paid)</option>
                    <option value="UNPAID">Unpaid Leave</option>
                  </select>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
                    Note: If your paid leave limits are exceeded, this may automatically convert to unpaid leave.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newLeave.endDate}
                      min={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestLeaveMut.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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
