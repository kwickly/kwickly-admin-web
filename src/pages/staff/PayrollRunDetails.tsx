import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Edit, Check, CheckCircle2, Download, FileText, FileSpreadsheet } from "lucide-react";
import {
  usePayrollRun,
  useUpdateSalarySlip,
  useAdvancePayrollStatus,
} from "@/hooks/api/useStaffPayroll";
import {
  Card,
  CardContent,
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
import { PageBreadcrumbs } from "@/components/ui/breadcrumbs";
import { formatCurrency } from "@/lib/currency";

export default function PayrollRunDetails() {
  const { id: runId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!runId) return <div>Invalid Payroll Run ID</div>;

  const { data: run, isLoading } = usePayrollRun(runId);
  const updateSlipMutation = useUpdateSalarySlip();
  const advanceMutation = useAdvancePayrollStatus();

  const [editingSlip, setEditingSlip] = useState<{
    id: string;
    bonus: string;
    deductions: string;
  } | null>(null);
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  if (isLoading || !run) {
    return <div className="text-center py-12 text-slate-500">Loading formal ledger...</div>;
  }

  const handleSaveSlip = () => {
    if (!editingSlip) return;
    updateSlipMutation.mutate(
      {
        id: editingSlip.id,
        bonus: parseFloat(editingSlip.bonus || "0"),
        deductions: parseFloat(editingSlip.deductions || "0"),
      },
      {
        onSuccess: () => {
          toast.success("Salary slip updated!");
          setEditingSlip(null);
        },
      },
    );
  };

  const handleAdvance = (status: "PROCESSED" | "PAID") => {
    advanceMutation.mutate(
      { id: runId, status },
      {
        onSuccess: () => toast.success(`Payroll marked as ${status}`),
      },
    );
  };
  
  const handleExport = (format: 'PDF' | 'CSV') => {
    // Placeholder for actual export logic
    toast.success(`Exporting detailed ledger as ${format}...`);
    setIsExportModalOpen(false);
  }

  const totalBase = run.slips?.reduce((acc, slip) => acc + parseFloat(slip.baseAmount), 0) || 0;
  const totalOvertime = run.slips?.reduce((acc, slip) => acc + parseFloat(slip.overtimeAmount), 0) || 0;
  const totalGross = totalBase + totalOvertime;
  const totalBonuses = run.slips?.reduce((acc, slip) => acc + parseFloat(slip.bonus), 0) || 0;
  const totalDeductions = run.slips?.reduce((acc, slip) => acc + parseFloat(slip.deductions), 0) || 0;
  const totalNet = run.slips?.reduce((acc, slip) => acc + parseFloat(slip.netPayable), 0) || 0;

  // Ideally, get the currency from the branch/tenant context, hardcoding INR default for now
  const currencyCode = "INR";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageBreadcrumbs
            items={[
              { label: "Staff", href: "/staff/directory" },
              { label: "Payroll History", href: "/staff/payroll" },
              { label: "Ledger", current: true }
            ]}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Payroll Ledger
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-1">
            Period: {format(new Date(run.periodStartDate), "MMMM d, yyyy")} &mdash;{" "}
            {format(new Date(run.periodEndDate), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`text-sm px-4 py-1.5 uppercase tracking-wider ${
            run.status === "PAID" ? "bg-emerald-100 text-emerald-800" :
            run.status === "PROCESSED" ? "bg-indigo-100 text-indigo-800" :
            "bg-slate-200 text-slate-800"
          }`}>
            {run.status}
          </Badge>

          <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {run.status === "DRAFT" && (
            <Button
              onClick={() => handleAdvance("PROCESSED")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Finalize Ledger
            </Button>
          )}
          {run.status === "PROCESSED" && (
            <Button
              onClick={() => handleAdvance("PAID")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Comprehensive KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Gross Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold">{formatCurrency(totalGross, currencyCode)}</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 dark:border-emerald-900/30 shadow-sm bg-emerald-50/50 dark:bg-emerald-900/10">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Total Bonuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold text-emerald-700 dark:text-emerald-500">
              +{formatCurrency(totalBonuses, currencyCode)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-rose-100 dark:border-rose-900/30 shadow-sm bg-rose-50/50 dark:bg-rose-900/10">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Total Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold text-rose-700 dark:text-rose-500">
              -{formatCurrency(totalDeductions, currencyCode)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 dark:border-zinc-700 shadow-md bg-slate-900 dark:bg-zinc-800 text-white">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Total Net Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold">{formatCurrency(totalNet, currencyCode)}</div>
            <p className="text-xs text-slate-400 mt-1">Across {run.slips?.length || 0} staff members</p>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card className="border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/50 pb-4">
          <CardTitle>Detailed Salary Slips</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100/50 dark:bg-zinc-900/80">
              <TableRow>
                <TableHead className="w-[250px]">Staff Member</TableHead>
                <TableHead className="text-right">Base ($)</TableHead>
                <TableHead className="text-right">Overtime ($)</TableHead>
                <TableHead className="text-right text-emerald-700 dark:text-emerald-500">Bonus ($)</TableHead>
                <TableHead className="text-right text-rose-700 dark:text-rose-500">Deductions ($)</TableHead>
                <TableHead className="text-right font-bold text-slate-900 dark:text-white border-l border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">Net Payable</TableHead>
                <TableHead className="text-center w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {run.slips?.map((slip) => (
                <TableRow key={slip.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/30">
                  <TableCell>
                    <div className="font-semibold text-slate-900 dark:text-white">{slip.staff?.name}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {slip.staff?.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-600 dark:text-zinc-400">
                    {formatCurrency(parseFloat(slip.baseAmount), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-600 dark:text-zinc-400">
                    {formatCurrency(parseFloat(slip.overtimeAmount), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-600 font-medium">
                    {formatCurrency(parseFloat(slip.bonus), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-rose-600 font-medium">
                    {formatCurrency(parseFloat(slip.deductions), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-900 dark:text-white border-l border-slate-200 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/20 text-lg">
                    {formatCurrency(parseFloat(slip.netPayable), currencyCode)}
                  </TableCell>
                  <TableCell className="text-center">
                    {run.status === "DRAFT" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                        onClick={() =>
                          setEditingSlip({
                            id: slip.id,
                            bonus: slip.bonus,
                            deductions: slip.deductions,
                          })
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                       <span className="text-xs text-slate-400 italic">Locked</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Adjust Slip Modal */}
      <Dialog
        open={!!editingSlip}
        onOpenChange={(open) => !open && setEditingSlip(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Salary Slip</DialogTitle>
            <DialogDescription>
              Add a one-time bonus or manual deduction for this pay period. Net
              payable will be automatically recalculated.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Bonus Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                className="font-mono"
                value={editingSlip?.bonus || ""}
                onChange={(e) =>
                  setEditingSlip((prev) =>
                    prev ? { ...prev, bonus: e.target.value } : null,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Deductions ($)</Label>
              <Input
                type="number"
                step="0.01"
                className="font-mono text-rose-600"
                value={editingSlip?.deductions || ""}
                onChange={(e) =>
                  setEditingSlip((prev) =>
                    prev ? { ...prev, deductions: e.target.value } : null,
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSlip(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSlip}
              disabled={updateSlipMutation.isPending}
              className="bg-indigo-600 text-white"
            >
              {updateSlipMutation.isPending ? "Saving..." : "Save Adjustments"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Modal */}
      <Dialog
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Payroll Ledger</DialogTitle>
            <DialogDescription>
              Download a comprehensive report of this payroll run.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card className="cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors" onClick={() => handleExport('CSV')}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">CSV Export</div>
                  <div className="text-xs text-slate-500 mt-1">Raw data for accounting software</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors" onClick={() => handleExport('PDF')}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">PDF Ledger</div>
                  <div className="text-xs text-slate-500 mt-1">Formatted document for records</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
