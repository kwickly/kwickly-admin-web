import { Icons } from '@/components/shared/icons';
import RoleBuilder from "@/features/staff/components/RoleBuilder";


export default function StaffRoles() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Icons.ShieldCheck className="h-6 w-6 text-primary" />
          Custom Role Builder
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Customize access roles and permissions for your staff.
        </p>
      </div>

      <RoleBuilder />
    </div>
  );
}
