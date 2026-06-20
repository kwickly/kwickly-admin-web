import { ShieldAlert } from "lucide-react";

export default function PlatformStaff() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Platform Staff & Admins
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage system administrators and platform owners.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center h-64 border border-dashed border-slate-300 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900/50">
        <div className="text-center">
          <ShieldAlert className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Admin Directory</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            You are currently viewing the system super-admins list. Add new admins to delegate platform management.
          </p>
        </div>
      </div>
    </div>
  );
}
