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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationControls } from "@/components/ui/pagination-controls";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTimesheets = (timesheets || []).filter(ts => {
    const matchesSearch = searchQuery === "" || 
      ts.staffName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ts.staffId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || ts.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);
  const paginatedTimesheets = filteredTimesheets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">


      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff or ID..."
            className="pl-9 bg-background"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'ALL')}>
            <SelectTrigger className="w-full sm:w-[150px] bg-background">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
      <div className="text-center py-6 text-muted-foreground">Loading timesheets...</div>
      ) : !timesheets || timesheets.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl text-muted-foreground">
          No timesheet records found for this branch.
        </div>
      ) : filteredTimesheets.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl text-muted-foreground">
          No timesheet records match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
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
                {paginatedTimesheets.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-foreground">
                    {record.staffName}
                    <div className="text-xs text-muted-foreground font-normal">ID: {record.staffId}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(record.clockIn).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 font-mono">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {record.clockOut ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(record.clockOut).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 font-mono">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </>
                    ) : (
                      <span className="text-warning font-medium">Still Clocked In</span>
                    )}
                  </TableCell>
                  <TableCell className="text-foreground font-mono font-semibold">
                    {record.totalHours != null ? `${record.totalHours} hrs` : <span className="text-muted-foreground font-normal">--</span>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={record.status === 'APPROVED' ? 'outline' : record.status === 'REJECTED' ? 'destructive' : 'secondary'}
                      className={
                        record.status === 'APPROVED'
                          ? 'border-success text-success bg-success/5'
                          : ''
                      }
                    >
                      {record.status}
                    </Badge>
                    {record.reviewerNotes && (
                      <div className="flex items-start gap-1 mt-2 text-[10px] text-muted-foreground bg-muted/50 p-1.5 rounded border border-border">
                        <MessageSquareText className="h-3 w-3 mt-0.5 shrink-0" />
                        <span className="leading-tight">{record.reviewerNotes}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {record.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => {
                            setActionModal({ isOpen: true, type: 'APPROVED', recordId: record.id });
                            setRemark("");
                          }}
                          disabled={updateTimesheetMutation.isPending}
                          className="bg-success hover:bg-success/90 text-success-foreground flex items-center gap-1 h-8 px-2.5"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
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
                      <span className="text-xs text-muted-foreground">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-card border border-border p-6 rounded-xl shadow-sm mt-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, filteredTimesheets.length)}</span> of <span className="font-medium text-foreground">{filteredTimesheets.length}</span> results
              </p>
              <PaginationControls
                page={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
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
              className={actionModal.type === 'APPROVED' ? 'bg-success hover:bg-success/90 text-success-foreground' : ''}
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
