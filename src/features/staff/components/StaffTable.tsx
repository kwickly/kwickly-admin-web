import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { useStaffList } from "@/hooks/api/useStaff"

export default function StaffTable() {
  const { data: staffList, isLoading } = useStaffList();

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
                  <div className="text-xs text-slate-500 font-normal">{staff.email}</div>
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
                <TableCell className="text-right">
                  <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
