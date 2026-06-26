import { useState } from "react";
import { useParams } from "react-router-dom";
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

  if (!runId) return <div className="text-foreground">Invalid Payroll Run ID</div>;

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
    return <div className="text-center py-12 text-muted-foreground">Loading formal ledger...</div>;
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Payroll Ledger
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Period: {format(new Date(run.periodStartDate), "MMMM d, yyyy")} &mdash;{" "}
            {format(new Date(run.periodEndDate), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`text-sm px-4 py-1.5 uppercase tracking-wider ${
            run.status === "PAID" ? "bg-success/10 text-success border border-success/20" :
            run.status === "PROCESSED" ? "bg-primary/10 text-primary border border-primary/20" :
            "bg-muted text-muted-foreground border border-border"
          }`}>
            {run.status}
          </Badge>

          <Button variant="outline" className="bg-transparent border-border hover:bg-muted/50" onClick={() => setIsExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {run.status === "DRAFT" && (
            <Button
              onClick={() => handleAdvance("PROCESSED")}
            >
              <Check className="h-4 w-4 mr-2" />
              Finalize Ledger
            </Button>
          )}
          {run.status === "PROCESSED" && (
            <Button
              onClick={() => handleAdvance("PAID")}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Comprehensive KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm bg-card">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Gross Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold text-foreground">{formatCurrency(totalGross, currencyCode)}</div>
          </CardContent>
        </Card>
        <Card className="border-success/20 shadow-sm bg-success/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-success">
              Total Bonuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold text-success">
              +{formatCurrency(totalBonuses, currencyCode)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 shadow-sm bg-destructive/5">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-destructive">
              Total Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold text-destructive">
              -{formatCurrency(totalDeductions, currencyCode)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 shadow-md bg-primary text-primary-foreground">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
              Total Net Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold">{formatCurrency(totalNet, currencyCode)}</div>
            <p className="text-xs text-primary-foreground/60 mt-1">Across {run.slips?.length || 0} staff members</p>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card className="border-border shadow-sm overflow-hidden bg-card">
        <CardHeader className="border-b border-border bg-muted/50 pb-4">
          <CardTitle>Detailed Salary Slips</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-[250px] text-muted-foreground">Staff Member</TableHead>
                <TableHead className="text-right text-muted-foreground">Base ($)</TableHead>
                <TableHead className="text-right text-muted-foreground">Overtime ($)</TableHead>
                <TableHead className="text-right text-success">Bonus ($)</TableHead>
                <TableHead className="text-right text-destructive">Deductions ($)</TableHead>
                <TableHead className="text-right font-bold text-foreground border-l border-border bg-muted/50">Net Payable</TableHead>
                <TableHead className="text-center w-[80px] text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {run.slips?.map((slip) => (
                <TableRow key={slip.id} className="hover:bg-muted/50 border-border">
                  <TableCell>
                    <div className="font-semibold text-foreground">{slip.staff?.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {slip.staff?.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatCurrency(parseFloat(slip.baseAmount), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatCurrency(parseFloat(slip.overtimeAmount), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-success font-medium">
                    {formatCurrency(parseFloat(slip.bonus), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-destructive font-medium">
                    {formatCurrency(parseFloat(slip.deductions), currencyCode)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-foreground border-l border-border bg-muted/20 text-lg">
                    {formatCurrency(parseFloat(slip.netPayable), currencyCode)}
                  </TableCell>
                  <TableCell className="text-center">
                    {run.status === "DRAFT" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
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
                       <span className="text-xs text-muted-foreground italic">Locked</span>
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
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Adjust Salary Slip</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a one-time bonus or manual deduction for this pay period. Net
              payable will be automatically recalculated.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Bonus Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                className="font-mono bg-transparent border-border text-foreground"
                value={editingSlip?.bonus || ""}
                onChange={(e) =>
                  setEditingSlip((prev) =>
                    prev ? { ...prev, bonus: e.target.value } : null,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Deductions ($)</Label>
              <Input
                type="number"
                step="0.01"
                className="font-mono text-destructive bg-transparent border-border"
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
            <Button variant="outline" className="bg-transparent border-border text-foreground hover:bg-muted/50" onClick={() => setEditingSlip(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSlip}
              disabled={updateSlipMutation.isPending}
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
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Export Payroll Ledger</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Download a comprehensive report of this payroll run.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card className="cursor-pointer border-border hover:border-primary hover:bg-primary/5 transition-colors bg-card" onClick={() => handleExport('CSV')}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="h-12 w-12 bg-success/10 text-success rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">CSV Export</div>
                  <div className="text-xs text-muted-foreground mt-1">Raw data for accounting software</div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer border-border hover:border-primary hover:bg-primary/5 transition-colors bg-card" onClick={() => handleExport('PDF')}>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="h-12 w-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">PDF Ledger</div>
                  <div className="text-xs text-muted-foreground mt-1">Formatted document for records</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
