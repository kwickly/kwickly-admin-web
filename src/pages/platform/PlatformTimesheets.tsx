import { Icons } from '@/components/shared/icons';
import Timesheets from "@/features/staff/components/Timesheets";

export default function PlatformTimesheets() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Icons.CalendarClock className="h-6 w-6 text-primary" />
            Platform Timesheets
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Review and approve timesheets for global platform staff and super admins.
          </p>
        </div>
      </div>

      <Timesheets isPlatform={true} />
    </div>
  );
}
