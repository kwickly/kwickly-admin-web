import React, { useState } from "react";
import { format } from "date-fns";
import { Banknote, Play, FileText, ChevronRight, Calculator, Edit, Check, CheckCircle2 } from "lucide-react";
import {
  usePayrollRuns,
  useGeneratePayroll,
  useAdvancePayrollStatus,
  usePayrollRun,
  useUpdateSalarySlip
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
  const advanceMutation = useAdvancePayrollStatus();
  
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    if (!startDate || !endDate) return;

    generateMutation.mutate({ periodStartDate: startDate, periodEndDate: endDate }, {
      onSuccess: () => {
        toast.success("Payroll run generated successfully!");
        setIsGenerateModalOpen(false);
      },
      onError: (err: any) => toast.error(err.message || "Failed to generate payroll")
    });
  };

  if (selectedRunId) {
    return <PayrollRunDetails runId={selectedRunId} onBack={() => setSelectedRunId(null)} />;
  }

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

        <Button onClick={() => setIsGenerateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Play className="h-4 w-4 mr-2" />
          Run Payroll
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 pb-4">
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>All generated payroll runs for your tenant.</CardDescription>
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
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading payroll history...</TableCell>
                </TableRow>
              ) : !runs || runs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No payroll runs found. Generate your first payroll above.
                  </TableCell>
                </TableRow>
              ) : (
                runs.map((run) => (
                  <TableRow key={run.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors" onClick={() => setSelectedRunId(run.id)}>
                    <TableCell className="font-medium">
                      {format(new Date(run.periodStartDate), "MMM d, yyyy")} - {format(new Date(run.periodEndDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {format(new Date(run.createdAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {run.slips?.length || 0} staff
                    </TableCell>
                    <TableCell>
                      <Badge variant={run.status === 'PAID' ? 'outline' : run.status === 'PROCESSED' ? 'default' : 'secondary'}
                        className={run.status === 'PAID' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : run.status === 'PROCESSED' ? 'bg-indigo-600' : ''}
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
              Select the date range to aggregate timesheets and generate salary slips.
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
              <Button type="button" variant="outline" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={generateMutation.isPending} className="bg-indigo-600 text-white">
                {generateMutation.isPending ? "Generating..." : "Generate Run"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Details View Component ──────────────────────────────────────────────────

function PayrollRunDetails({ runId, onBack }: { runId: string; onBack: () => void }) {
  const { data: run, isLoading } = usePayrollRun(runId);
  const updateSlipMutation = useUpdateSalarySlip();
  const advanceMutation = useAdvancePayrollStatus();

  const [editingSlip, setEditingSlip] = useState<{ id: string, bonus: string, deductions: string } | null>(null);

  if (isLoading || !run) {
    return <div className="text-center py-12">Loading run details...</div>;
  }

  const handleSaveSlip = () => {
    if (!editingSlip) return;
    updateSlipMutation.mutate({
      id: editingSlip.id,
      bonus: parseFloat(editingSlip.bonus || "0"),
      deductions: parseFloat(editingSlip.deductions || "0"),
    }, {
      onSuccess: () => {
        toast.success("Salary slip updated!");
        setEditingSlip(null);
      }
    });
  };

  const handleAdvance = (status: 'PROCESSED' | 'PAID') => {
    advanceMutation.mutate({ id: runId, status }, {
      onSuccess: () => toast.success(`Payroll marked as ${status}`)
    });
  };

  const totalPayroll = run.slips?.reduce((acc, slip) => acc + parseFloat(slip.netPayable), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button variant="link" onClick={onBack} className="px-0 text-slate-500 mb-2 h-auto">
            &larr; Back to Payroll History
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Payroll Run Details
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {format(new Date(run.periodStartDate), "MMMM d, yyyy")} to {format(new Date(run.periodEndDate), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="text-sm px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">
            Status: {run.status}
          </Badge>

          {run.status === 'DRAFT' && (
            <Button onClick={() => handleAdvance('PROCESSED')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Check className="h-4 w-4 mr-2" />
              Mark as Processed
            </Button>
          )}
          {run.status === 'PROCESSED' && (
            <Button onClick={() => handleAdvance('PAID')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Payroll Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalPayroll.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Staff Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{run.slips?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 pb-4">
          <CardTitle>Individual Salary Slips</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead className="text-right">Base</TableHead>
                <TableHead className="text-right">Overtime</TableHead>
                <TableHead className="text-right text-emerald-600">Bonus</TableHead>
                <TableHead className="text-right text-rose-600">Deductions</TableHead>
                <TableHead className="text-right font-bold">Net Payable</TableHead>
                <TableHead className="text-right">Adjust</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {run.slips?.map(slip => (
                <TableRow key={slip.id}>
                  <TableCell>
                    <div className="font-medium">{slip.staff?.name}</div>
                    <div className="text-xs text-slate-500">{slip.staff?.email}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono">${slip.baseAmount}</TableCell>
                  <TableCell className="text-right font-mono">${slip.overtimeAmount}</TableCell>
                  <TableCell className="text-right font-mono text-emerald-600">${slip.bonus}</TableCell>
                  <TableCell className="text-right font-mono text-rose-600">${slip.deductions}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-900 dark:text-white">
                    ${slip.netPayable}
                  </TableCell>
                  <TableCell className="text-right">
                    {run.status === 'DRAFT' && (
                      <Button variant="ghost" size="sm" onClick={() => setEditingSlip({ id: slip.id, bonus: slip.bonus, deductions: slip.deductions })}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Adjust Slip Modal */}
      <Dialog open={!!editingSlip} onOpenChange={(open) => !open && setEditingSlip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Salary Slip</DialogTitle>
            <DialogDescription>
              Add a one-time bonus or manual deduction for this pay period. Net payable will be automatically recalculated.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Bonus Amount ($)</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={editingSlip?.bonus || ''} 
                onChange={(e) => setEditingSlip(prev => prev ? {...prev, bonus: e.target.value} : null)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Deductions ($)</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={editingSlip?.deductions || ''} 
                onChange={(e) => setEditingSlip(prev => prev ? {...prev, deductions: e.target.value} : null)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSlip(null)}>Cancel</Button>
            <Button onClick={handleSaveSlip} disabled={updateSlipMutation.isPending} className="bg-indigo-600 text-white">
              {updateSlipMutation.isPending ? "Saving..." : "Save Adjustments"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
