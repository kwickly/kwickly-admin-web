import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const MOCK_STAFF = [
  { id: "1", name: "Alice Johnson", role: "MANAGER", pin: "****", status: "Active" },
  { id: "2", name: "Bob Smith", role: "CASHIER", pin: "****", status: "Active" },
  { id: "3", name: "Charlie Davis", role: "KITCHEN", pin: "****", status: "Inactive" },
]

export default function StaffTable() {
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
          {MOCK_STAFF.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                {staff.name}
              </TableCell>
              <TableCell>
                <Badge variant={staff.role === 'MANAGER' ? 'default' : 'secondary'}>
                  {staff.role}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-slate-500 dark:text-zinc-400">
                {staff.pin}
              </TableCell>
              <TableCell>
                <Badge variant={staff.status === 'Active' ? 'outline' : 'destructive'}>
                  {staff.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
