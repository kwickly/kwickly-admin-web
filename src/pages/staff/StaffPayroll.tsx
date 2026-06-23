import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Play,
  ChevronRight,
} from "lucide-react";
import {
  usePayrollRuns,
  useGeneratePayroll,
} from "@/hooks/api/useStaffPayroll";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function StaffPayroll() {
  const { data: runs, isLoading } = usePayrollRuns();
  const generateMutation = useGeneratePayroll();
  const navigate = useNavigate();

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    if (!startDate || !endDate) return;

    generateMutation.mutate(
      { periodStartDate: startDate, periodEndDate: endDate },
      {
        onSuccess: () => {
          toast.success("Payroll run generated successfully!");
          setIsGenerateModalOpen(false);
        },
        onError: (err: any) =>
          toast.error(err.message || "Failed to generate payroll"),
      },
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Banknote className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Payroll Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Generate, review, and process monthly staff salaries.
          </p>
        </div>

        <Button
          onClick={() => setIsGenerateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Run Payroll
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 pb-4">
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>
            All generated payroll runs for your tenant.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead>Total Slips</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-slate-500"
                  >
                    Loading payroll history...
                  </TableCell>
                </TableRow>
              ) : !runs || runs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-slate-500"
                  >
                    No payroll runs found. Generate your first payroll above.
                  </TableCell>
                </TableRow>
              ) : (
                runs.map((run) => (
                  <TableRow
                    key={run.id}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors"
                    onClick={() => navigate(`/staff/payroll/${run.id}`)}
                  >
                    <TableCell className="font-medium">
                      {format(new Date(run.periodStartDate), "MMM d, yyyy")} -{" "}
                      {format(new Date(run.periodEndDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(run.createdAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{run.slips?.length || 0} staff</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          run.status === "PAID"
                            ? "outline"
                            : run.status === "PROCESSED"
                              ? "default"
                              : "secondary"
                        }
                        className={
                          run.status === "PAID"
                            ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                            : run.status === "PROCESSED"
                              ? "bg-indigo-600"
                              : ""
                        }
                      >
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generate Payroll Modal */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
            <DialogDescription>
              Select the date range to aggregate timesheets and generate salary
              slips.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" name="startDate" required />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" name="endDate" required />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGenerateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={generateMutation.isPending}
                className="bg-indigo-600 text-white"
              >
                {generateMutation.isPending ? "Generating..." : "Generate Run"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
