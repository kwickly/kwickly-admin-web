import StaffTable from "@/features/staff/components/StaffTable";
import CreateStaffDialog from "@/features/staff/components/CreateStaffDialog";
import { Users } from "lucide-react";

export default function Staff() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Staff Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage your employees, assign roles, and view POS PINs.
          </p>
        </div>
        <CreateStaffDialog />
      </div>

      <StaffTable />
    </div>
  );
}
