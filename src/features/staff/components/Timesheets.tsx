import { Check, X, Clock, Calendar } from "lucide-react";
import { useTimesheets, useUpdateTimesheet } from "@/hooks/api/useStaffAttendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Timesheets() {
  const { data: timesheets, isLoading } = useTimesheets();
  const updateTimesheetMutation = useUpdateTimesheet();

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateTimesheetMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(`Hours ${status.toLowerCase()} successfully`);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Timesheets & Approvals</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Review employee clock-in hours and approve them for payroll calculations.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-6 text-slate-500">Loading timesheets...</div>
      ) : !timesheets || timesheets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-500">
          No timesheet records found for this branch.
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                    {record.staffName}
                    <div className="text-xs text-slate-400 font-normal">ID: {record.staffId}</div>
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(record.clockIn).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 font-mono">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 text-xs">
                    {record.clockOut ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(record.clockOut).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 font-mono">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </>
                    ) : (
                      <span className="text-amber-500 font-medium">Still Clocked In</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-900 dark:text-zinc-100 font-mono font-semibold">
                    {record.totalHours} hrs
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={record.status === 'APPROVED' ? 'outline' : record.status === 'REJECTED' ? 'destructive' : 'secondary'}
                      className={
                        record.status === 'APPROVED'
                          ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10'
                          : ''
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {record.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(record.id, 'APPROVED')}
                          disabled={updateTimesheetMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 h-8 px-2.5"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(record.id, 'REJECTED')}
                          disabled={updateTimesheetMutation.isPending}
                          className="flex items-center gap-1 h-8 px-2.5"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
