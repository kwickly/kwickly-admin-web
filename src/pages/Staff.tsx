import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffTable from "@/features/staff/components/StaffTable";
import CreateStaffDialog from "@/features/staff/components/CreateStaffDialog";
import Timesheets from "@/features/staff/components/Timesheets";
import RoleBuilder from "@/features/staff/components/RoleBuilder";
import { Users } from "lucide-react";

export default function Staff() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Staff & HR Operations
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage your employees, review payroll logs, and customize access roles.
          </p>
        </div>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-zinc-900/50 p-1 border border-slate-200 dark:border-zinc-800 rounded-lg mb-6">
          <TabsTrigger value="directory" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Employee Directory
          </TabsTrigger>
          <TabsTrigger value="timesheets" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Timesheets & Approvals
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Custom Role Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-0 outline-none space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Staff Members</h2>
            <CreateStaffDialog />
          </div>
          <StaffTable />
        </TabsContent>

        <TabsContent value="timesheets" className="mt-0 outline-none">
          <Timesheets />
        </TabsContent>

        <TabsContent value="roles" className="mt-0 outline-none">
          <RoleBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
