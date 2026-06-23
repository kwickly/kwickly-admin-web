import { useState } from "react";
import { Check, X, Clock, Calendar, MessageSquareText } from "lucide-react";
import { useTimesheets, useUpdateTimesheet, usePlatformTimesheets, useUpdatePlatformTimesheet } from "@/hooks/api/useStaffAttendance";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Timesheets({ isPlatform = false }: { isPlatform?: boolean }) {
  const tenantTimesheets = useTimesheets();
  const platformTimesheetsHook = usePlatformTimesheets();
  
  const { data: timesheets, isLoading } = isPlatform ? platformTimesheetsHook : tenantTimesheets;
  
  const updateTenantMutation = useUpdateTimesheet();
  const updatePlatformMutation = useUpdatePlatformTimesheet();
  
  const updateTimesheetMutation = isPlatform ? updatePlatformMutation : updateTenantMutation;

  const [actionModal, setActionModal] = useState<{ isOpen: boolean, type: 'APPROVED' | 'REJECTED' | null, recordId: string | null }>({ isOpen: false, type: null, recordId: null });
  const [remark, setRemark] = useState("");

  const handleActionConfirm = () => {
    if (!actionModal.recordId || !actionModal.type) return;
    
    if (actionModal.type === 'REJECTED' && !remark.trim()) {
      toast.error("Rejection remark is required");
      return;
    }

    updateTimesheetMutation.mutate(
      { id: actionModal.recordId, status: actionModal.type, reviewerNotes: remark || undefined },
      {
        onSuccess: () => {
          toast.success(`Timesheet ${actionModal.type?.toLowerCase()} successfully`);
          setActionModal({ isOpen: false, type: null, recordId: null });
          setRemark("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">


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
                    {record.totalHours != null ? `${record.totalHours} hrs` : <span className="text-slate-400 font-normal">--</span>}
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
                    {record.reviewerNotes && (
                      <div className="flex items-start gap-1 mt-2 text-[10px] text-slate-500 bg-slate-50 dark:bg-zinc-900/50 p-1.5 rounded border border-slate-100 dark:border-zinc-800">
                        <MessageSquareText className="h-3 w-3 mt-0.5 shrink-0" />
                        <span className="leading-tight">{record.reviewerNotes}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {record.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setActionModal({ isOpen: true, type: 'APPROVED', recordId: record.id });
                            setRemark("");
                          }}
                          disabled={updateTimesheetMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 h-8 px-2.5"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setActionModal({ isOpen: true, type: 'REJECTED', recordId: record.id });
                            setRemark("");
                          }}
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

      {/* Action Modal */}
      <Dialog open={actionModal.isOpen} onOpenChange={(open) => !open && setActionModal({ ...actionModal, isOpen: false })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionModal.type === 'APPROVED' ? 'Approve Timesheet' : 'Reject Timesheet'}
            </DialogTitle>
            <DialogDescription>
              {actionModal.type === 'APPROVED' 
                ? 'Are you sure you want to approve this timesheet? You can optionally add an approval note.'
                : 'Please provide a mandatory reason for rejecting this timesheet.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>
                {actionModal.type === 'APPROVED' ? 'Approval Note (Optional)' : 'Rejection Reason (Required)'}
              </Label>
              <Textarea 
                placeholder="Type your remarks here..." 
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionModal({ ...actionModal, isOpen: false })}>
              Cancel
            </Button>
            <Button 
              variant={actionModal.type === 'REJECTED' ? 'destructive' : 'default'}
              className={actionModal.type === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
              onClick={handleActionConfirm}
              disabled={updateTimesheetMutation.isPending}
            >
              {updateTimesheetMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
