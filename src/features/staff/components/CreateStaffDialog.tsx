import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useCreateStaff } from "@/hooks/api/useStaff"

export default function CreateStaffDialog() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'manager' | 'cashier' | 'kitchen_staff' | 'qr_scanner' | ''>('')
  const [salaryType, setSalaryType] = useState<'HOURLY' | 'MONTHLY' | ''>('')
  const [baseSalary, setBaseSalary] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [open, setOpen] = useState(false)

  const { mutate: createStaff, isPending } = useCreateStaff()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone || !role) return

    const payload: any = {
      name,
      phone,
      role: role as 'manager' | 'cashier' | 'kitchen_staff' | 'qr_scanner',
    }

    if (salaryType) {
      payload.salaryType = salaryType
      if (salaryType === 'MONTHLY' && baseSalary) payload.baseSalary = baseSalary
      if (salaryType === 'HOURLY' && hourlyRate) payload.hourlyRate = hourlyRate
    }

    createStaff(
      payload,
      {
        onSuccess: () => {
          setOpen(false)
          setName('')
          setPhone('')
          setRole('')
          setSalaryType('')
          setBaseSalary('')
          setHourlyRate('')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-ignore - Radix UI type bug with TS 5.7+ */}
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Staff Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-zinc-100">Add Staff Member</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-zinc-400">
            Create a new staff account and assign a role. A 4-digit POS PIN will be automatically generated.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
            <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">
              Full Name
            </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-slate-700 dark:text-zinc-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-slate-700 dark:text-zinc-300">
                Role
              </Label>
              <Select value={role} onValueChange={(val: any) => setRole(val)} required>
                <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                  <SelectValue placeholder="Select a role" />
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
              <Label htmlFor="salaryType" className="text-slate-700 dark:text-zinc-300">
                Salary Type (Optional)
              </Label>
              <Select value={salaryType} onValueChange={(val: any) => setSalaryType(val)}>
                <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                  <SelectValue placeholder="Select salary model" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                  <SelectItem value="MONTHLY">Monthly Salary</SelectItem>
                  <SelectItem value="HOURLY">Hourly Wage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {salaryType === 'MONTHLY' && (
              <div className="grid gap-2">
                <Label htmlFor="baseSalary" className="text-slate-700 dark:text-zinc-300">
                  Base Salary (₹/month)
                </Label>
                <Input
                  id="baseSalary"
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  placeholder="e.g. 25000"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>
            )}

            {salaryType === 'HOURLY' && (
              <div className="grid gap-2">
                <Label htmlFor="hourlyRate" className="text-slate-700 dark:text-zinc-300">
                  Hourly Rate (₹/hour)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="e.g. 150"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
              {isPending ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
