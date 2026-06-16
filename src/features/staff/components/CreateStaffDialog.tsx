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

export default function CreateStaffDialog() {
  return (
    <Dialog>
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
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role" className="text-slate-700 dark:text-zinc-300">
              Role
            </Label>
            <Select>
              <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="CASHIER">Cashier</SelectItem>
                <SelectItem value="KITCHEN">Kitchen Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
            Create Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
