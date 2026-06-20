import { Shield } from "lucide-react";
import RoleBuilder from "@/features/staff/components/RoleBuilder";

export default function PlatformRoles() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Platform Role Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Configure granular permissions for platform owners and system administrators.
          </p>
        </div>
      </div>

      <RoleBuilder isPlatform={true} />
    </div>
  );
}
