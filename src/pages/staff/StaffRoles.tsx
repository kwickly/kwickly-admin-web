import RoleBuilder from "@/features/staff/components/RoleBuilder";
import { ShieldCheck } from "lucide-react";

export default function StaffRoles() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Custom Role Builder
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Customize access roles and permissions for your staff.
        </p>
      </div>

      <RoleBuilder />
    </div>
  );
}
