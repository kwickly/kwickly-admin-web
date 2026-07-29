import { Icons } from '@/components/shared/icons';
import RoleBuilder from "@/features/staff/components/RoleBuilder";
import { PageHeader } from '@/components/ui/page-header';

export default function PlatformRoles() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Platform Role Builder"
        description="Configure granular permissions for platform owners and system administrators."
        icon={Icons.Shield}
      />

      <RoleBuilder isPlatform={true} />
    </div>
  );
}
