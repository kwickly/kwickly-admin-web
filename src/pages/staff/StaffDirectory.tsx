import { Icons } from '@/components/shared/icons';
import StaffTable from "@/features/staff/components/StaffTable";
import CreateStaffDialog from "@/features/staff/components/CreateStaffDialog";

import { Can } from "@/components/shared/Can";
import { PageHeader } from '@/components/ui/page-header';

export default function StaffDirectory() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader
        title="Employee Directory"
        description="Manage your employees and their basic information."
        icon={Icons.Users}
        children={
          <>
            <Can perform="staff:write">
          <CreateStaffDialog />
        </Can>
          </>
        }
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Staff Members</h2>
        </div>
        <StaffTable />
      </div>
    </div>
  );
}
