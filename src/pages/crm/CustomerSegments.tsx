import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { useSegments, useCreateSegment } from "@/hooks/api/useCRM";
import { GridCardSkeleton } from "@/components/ui/loaders";
import { PaginationControls } from "@/components/ui/pagination-controls";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function CustomerSegments() {
  const [page, setPage] = useState(1);
  const { data: response, isLoading: isSegsLoading } = useSegments(page, 12);
  const createSegmentMutation = useCreateSegment();

  const segments = response?.data || [];
  const meta = response?.meta;

  // Create Segment State
  const [segOpen, setSegOpen] = useState(false);
  const [segName, setSegName] = useState('');
  const [ruleType, setRuleType] = useState('days_since_scan');
  const [ruleValue, setRuleValue] = useState('');

  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!segName || !ruleValue) return;

    createSegmentMutation.mutate(
      { name: segName, ruleType, ruleValue },
      {
        onSuccess: () => {
          toast.success("Segment created successfully");
          setSegOpen(false);
          setSegName('');
          setRuleValue('');
        }
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Customer Segments
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Define filter rules to group subscribers dynamically.
          </p>
        </div>
        <Dialog open={segOpen} onOpenChange={setSegOpen}>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-zinc-100">Create Customer Segment</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-zinc-400">
                Define filter rules to group subscribers dynamically.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSegment} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="segName" className="text-slate-700 dark:text-zinc-300">Segment Name</Label>
                <Input
                  id="segName"
                  value={segName}
                  onChange={(e) => setSegName(e.target.value)}
                  placeholder="e.g. Inactive Diners"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ruleType" className="text-slate-700 dark:text-zinc-300">Rule Trigger</Label>
                <Select value={ruleType} onValueChange={(val: any) => setRuleType(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="days_since_scan">Days Since Last Meal Scan</SelectItem>
                    <SelectItem value="total_scans">Total Scans Ever</SelectItem>
                    <SelectItem value="signup_days">Signup Age (Days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ruleValue" className="text-slate-700 dark:text-zinc-300">Rule Condition Value</Label>
                <Input
                  id="ruleValue"
                  type="number"
                  value={ruleValue}
                  onChange={(e) => setRuleValue(e.target.value)}
                  placeholder="e.g. 5"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={createSegmentMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                  {createSegmentMutation.isPending ? 'Saving...' : 'Save Segment'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isSegsLoading ? (
        <GridCardSkeleton count={6} />
      ) : !segments || segments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-500">
          No segments configured yet.
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Segment Name</TableHead>
                <TableHead>Condition Rule</TableHead>
                <TableHead>Subscribers Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((seg) => (
                <TableRow key={seg.id}>
                  <TableCell className="font-medium text-slate-900 dark:text-zinc-100">{seg.name}</TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 capitalize font-mono text-xs">
                    {seg.ruleType.replace(/_/g, ' ')} &gt;= {seg.ruleValue}
                  </TableCell>
                  <TableCell className="text-slate-900 dark:text-zinc-100 font-semibold">{seg.customerCount} users</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {meta && (
            <PaginationControls 
              page={meta.page} 
              totalPages={meta.totalPages} 
              onPageChange={setPage} 
            />
          )}
        </div>
      )}
    </div>
  );
}
