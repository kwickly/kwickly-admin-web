import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
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
  const [search, setSearch] = useState("");
  const { data: response, isLoading: isSegsLoading } = useSegments(page, 12, search);
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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Customer Segments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define filter rules to group subscribers dynamically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search segments..." 
            className="w-56"
          />
          <Dialog open={segOpen} onOpenChange={setSegOpen}>
            {/* @ts-ignore */}
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Customer Segment</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Define filter rules to group subscribers dynamically.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSegment} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="segName" className="text-foreground">Segment Name</Label>
                <Input
                  id="segName"
                  value={segName}
                  onChange={(e) => setSegName(e.target.value)}
                  placeholder="e.g. Inactive Diners"
                  className="bg-transparent"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ruleType" className="text-foreground">Rule Trigger</Label>
                <Select value={ruleType} onValueChange={(val: any) => setRuleType(val)}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="days_since_scan">Days Since Last Meal Scan</SelectItem>
                    <SelectItem value="total_scans">Total Scans Ever</SelectItem>
                    <SelectItem value="signup_days">Signup Age (Days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ruleValue" className="text-foreground">Rule Condition Value</Label>
                <Input
                  id="ruleValue"
                  type="number"
                  value={ruleValue}
                  onChange={(e) => setRuleValue(e.target.value)}
                  placeholder="e.g. 5"
                  className="bg-transparent"
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={createSegmentMutation.isPending} className="w-full">
                  {createSegmentMutation.isPending ? 'Saving...' : 'Save Segment'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {isSegsLoading ? (
        <GridCardSkeleton count={6} />
      ) : !segments || segments.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl text-muted-foreground">
          No segments configured yet.
        </div>
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Segment Name</TableHead>
                <TableHead>Condition Rule</TableHead>
                <TableHead>Subscribers Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((seg) => (
                <TableRow key={seg.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{seg.name}</TableCell>
                  <TableCell className="text-muted-foreground capitalize font-mono text-xs">
                    {seg.ruleType.replace(/_/g, ' ')} &gt;= {seg.ruleValue}
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">{seg.customerCount} users</TableCell>
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
