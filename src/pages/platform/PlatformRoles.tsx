import { Shield } from "lucide-react";
import RoleBuilder from "@/features/staff/components/RoleBuilder";

export default function PlatformRoles() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Platform Role Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure granular permissions for platform owners and system administrators.
          </p>
        </div>
      </div>

      <RoleBuilder isPlatform={true} />
    </div>
  );
}
