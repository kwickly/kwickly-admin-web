import RoleBuilder from "@/features/staff/components/RoleBuilder";
import { ShieldCheck } from "lucide-react";

export default function StaffRoles() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Custom Role Builder
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize access roles and permissions for your staff.
        </p>
      </div>

      <RoleBuilder />
    </div>
  );
}
