import Timesheets from "@/features/staff/components/Timesheets";
import { Clock } from "lucide-react";

export default function StaffTimesheets() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Timesheets & Approvals
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve employee payroll logs and attendance.
        </p>
      </div>

      <Timesheets />
    </div>
  );
}
