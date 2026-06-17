import StaffTable from "@/features/staff/components/StaffTable";
import CreateStaffDialog from "@/features/staff/components/CreateStaffDialog";
import { Users } from "lucide-react";
import { Can } from "@/components/shared/Can";

export default function StaffDirectory() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Employee Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage your employees and their basic information.
          </p>
        </div>
        <Can perform="staff:write">
          <CreateStaffDialog />
        </Can>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Staff Members</h2>
        </div>
        <StaffTable />
      </div>
    </div>
  );
}
