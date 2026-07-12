import React, { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuth';
import { format } from 'date-fns';
import { PaginationControls } from '@/components/ui/pagination-controls';
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
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil((holidays?.length || 0) / pageSize);
  const paginatedHolidays = (holidays || []).slice((page - 1) * pageSize, page * pageSize);

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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Public Holidays
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage public holidays for the tenant. Staff working on these dates may receive holiday pay.
          </p>
        </div>
        <div className="flex gap-2">
          {isManager && (
            <button
              onClick={() => setIsHolidayModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Declare Holiday
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Holiday Name</th>
                <th className="px-6 py-4">Date</th>
                {isManager && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loadingHolidays ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : holidays?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No public holidays declared.</td>
                </tr>
              ) : (
                paginatedHolidays.map((holiday) => (
                  <tr key={holiday.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary/70" />
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
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
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
        <div className="p-4 border-t border-border">
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Declare Holiday Modal */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95">
          <div className="bg-card w-full max-w-md rounded-xl shadow-sm overflow-hidden border border-border">
            <form onSubmit={handleDeclareHoliday}>
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Declare Public Holiday</h3>
                <p className="text-sm text-muted-foreground mt-1">Staff working on this date will receive 1.5x holiday pay.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Holiday Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Independence Day"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    className="w-full px-3 py-2 bg-transparent border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    className="w-full px-3 py-2 bg-transparent border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
              </div>
              <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-muted/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={declareHolidayMut.isPending}
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
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
