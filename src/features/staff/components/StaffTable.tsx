import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStaffList, useUpdateStaff, useDeleteStaff, useUpdateStaffPin, type StaffMember } from "@/hooks/api/useStaff"
import { useBranchStore } from "@/store/useBranch"
import { Can } from "@/components/shared/Can"

export default function StaffTable() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  const { data: staffList, isLoading } = useStaffList(branchId);

  const { mutate: updateStaff, isPending: isUpdating } = useUpdateStaff();
  const { mutate: deleteStaff, isPending: isDeleting } = useDeleteStaff();
  const { mutate: updatePin, isPending: isUpdatingPin } = useUpdateStaffPin();

  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'manager' | 'cashier' | 'kitchen_staff' | 'qr_scanner' | ''>('');
  const [isActive, setIsActive] = useState<string>('true');
  const [salaryType, setSalaryType] = useState<'HOURLY' | 'MONTHLY' | ''>('');
  const [baseSalary, setBaseSalary] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleEditClick = (staff: StaffMember) => {
    setEditingStaff(staff);
    setName(staff.name);
    setPhone(staff.phone || '');
    setRole(staff.role as any);
    setIsActive(staff.isActive ? 'true' : 'false');
    
    // Typecast or map optional fields
    const s = staff as any;
    setSalaryType(s.salaryType || '');
    setBaseSalary(s.baseSalary || '');
    setHourlyRate(s.hourlyRate || '');

    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const payload: any = {
      name,
      phone,
      role: role as any,
      isActive: isActive === 'true',
      salaryType: salaryType || null,
      baseSalary: salaryType === 'MONTHLY' ? baseSalary || null : null,
      hourlyRate: salaryType === 'HOURLY' ? hourlyRate || null : null,
    };

    updateStaff(
      { id: editingStaff.id, payload },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingStaff(null);
        },
      }
    );
  };

  const handleDeleteSubmit = () => {
    if (!editingStaff) return;
    deleteStaff(editingStaff.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingStaff(null);
      },
    });
  };

  const handleSetPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff || newPin.length !== 4) return;
    
    updatePin(
      { id: editingStaff.id, pin: newPin },
      {
        onSuccess: () => {
          setIsPinDialogOpen(false);
          setEditingStaff(null);
          setNewPin('');
        }
      }
    );
  };

  return (
    <div className="rounded-md border border-slate-200 dark:border-zinc-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>POS PIN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                Loading staff...
              </TableCell>
            </TableRow>
          ) : !staffList || staffList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                No staff members found.
              </TableCell>
            </TableRow>
          ) : (
            staffList.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                  {staff.name}
                  <div className="text-xs text-slate-500 font-normal">{staff.phone}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={staff.role === 'manager' || staff.role === 'tenant_owner' ? 'default' : 'secondary'}>
                    {staff.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-slate-500 dark:text-zinc-400">
                  {staff.pin ? '****' : 'Not Set'}
                </TableCell>
                <TableCell>
                  <Badge variant={staff.isActive ? 'outline' : 'destructive'}>
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <Can perform="staff:write">
                    <button
                      onClick={() => { setEditingStaff(staff); setNewPin(''); setIsPinDialogOpen(true); }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                    >
                      Set PIN
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button
                      onClick={() => handleEditClick(staff)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                    >
                      Edit
                    </button>
                  </Can>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">Edit Staff Member</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Update employee roles, status, and salary structures.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-slate-700 dark:text-zinc-300">Full Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-phone" className="text-slate-700 dark:text-zinc-300">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-role" className="text-slate-700 dark:text-zinc-300">Role</Label>
                <Select value={role} onValueChange={(val: any) => setRole(val)} required>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="kitchen_staff">Kitchen Staff</SelectItem>
                    <SelectItem value="qr_scanner">QR Scanner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status" className="text-slate-700 dark:text-zinc-300">Status</Label>
                <Select value={isActive} onValueChange={(val: any) => setIsActive(val || 'true')} required>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-salaryType" className="text-slate-700 dark:text-zinc-300">Salary Type</Label>
                <Select value={salaryType} onValueChange={(val: any) => setSalaryType(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue placeholder="None / Commission Only" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="MONTHLY">Monthly Salary</SelectItem>
                    <SelectItem value="HOURLY">Hourly Wage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {salaryType === 'MONTHLY' && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-baseSalary" className="text-slate-700 dark:text-zinc-300">Base Salary (₹/month)</Label>
                  <Input
                    id="edit-baseSalary"
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                    required
                  />
                </div>
              )}

              {salaryType === 'HOURLY' && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-hourlyRate" className="text-slate-700 dark:text-zinc-300">Hourly Rate (₹/hour)</Label>
                  <Input
                    id="edit-hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                    required
                  />
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Staff
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">Delete Staff Member?</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Are you sure you want to delete {editingStaff?.name}? This action cannot be undone and will revoke their portal access immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set PIN Dialog */}
      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">Set POS PIN</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Set a 4-digit PIN for {editingStaff?.name} to log in to the POS and KDS devices.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSetPinSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-pin" className="text-slate-700 dark:text-zinc-300">4-Digit PIN</Label>
                <Input
                  id="new-pin"
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setNewPin(val);
                  }}
                  className="bg-transparent text-center tracking-[1em] font-mono text-2xl border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 h-14"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPinDialogOpen(false)}
                className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingPin || newPin.length !== 4}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isUpdatingPin ? 'Saving...' : 'Save PIN'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
