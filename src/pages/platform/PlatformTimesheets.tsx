import { Icons } from '@/components/shared/icons';
import Timesheets from "@/features/staff/components/Timesheets";
import { PageHeader } from '@/components/ui/page-header';

export default function PlatformTimesheets() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader
        title="Platform Timesheets"
        description="Review and approve timesheets for global platform staff and super admins."
        icon={Icons.CalendarClock}
      />

      <Timesheets isPlatform={true} />
    </div>
  );
}
