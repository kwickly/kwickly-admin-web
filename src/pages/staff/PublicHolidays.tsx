import React, { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuth';
import { format } from 'date-fns';
import {
  usePublicHolidays,
  useDeclareHoliday,
  useRemoveHoliday
} from '../../hooks/useLeaveManagement';

export default function PublicHolidays() {
  const user = useAuthStore((state) => state.user);
  
  // Queries
  const { data: holidays, isLoading: loadingHolidays } = usePublicHolidays();

  // Mutations
  const declareHolidayMut = useDeclareHoliday();
  const removeHolidayMut = useRemoveHoliday();

  // State
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });

  const isManager = user?.roleDetails?.permissions?.includes('attendance:manage') || 
                    user?.role === 'platform_owner' || user?.role === 'tenant_owner' || user?.role === 'super_admin';

  const handleDeclareHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    await declareHolidayMut.mutateAsync(newHoliday);
    setIsHolidayModalOpen(false);
    setNewHoliday({ name: '', date: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Public Holidays
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage public holidays for the tenant. Staff working on these dates may receive holiday pay.
          </p>
        </div>
        <div className="flex gap-2">
          {isManager && (
            <button
              onClick={() => setIsHolidayModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
            >
              <Plus className="h-4 w-4" />
              Declare Holiday
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-400">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 font-medium border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Holiday Name</th>
                <th className="px-6 py-4">Date</th>
                {isManager && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {loadingHolidays ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : holidays?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No public holidays declared.</td>
                </tr>
              ) : (
                holidays?.map((holiday) => (
                  <tr key={holiday.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      {holiday.name}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(holiday.date), 'MMMM d, yyyy')}
                    </td>
                    {isManager && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeHolidayMut.mutate(holiday.id)}
                          disabled={removeHolidayMut.isPending}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declare Holiday Modal */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
            <form onSubmit={handleDeclareHoliday}>
              <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Declare Public Holiday</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Staff working on this date will receive 1.5x holiday pay.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Holiday Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Independence Day"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={declareHolidayMut.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Declare Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
