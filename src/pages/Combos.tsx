import { Blocks } from "lucide-react";
import CreateComboSheet from "@/features/combos/components/CreateComboSheet";
import { useCombos } from "@/hooks/api/useCombos";
import { useBranchStore } from "@/store/useBranch";
import { GridCardSkeleton } from "@/components/ui/loaders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Combos() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  
  const { data: combos, isLoading } = useCombos(branchId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Blocks className="h-6 w-6 text-primary" />
            Combo Meals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Group existing menu items into meal combos with custom pricing.
          </p>
        </div>
        <CreateComboSheet />
      </div>

      {isLoading ? (
        <GridCardSkeleton count={4} />
      ) : !combos || combos.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-xl border border-border">
          <Blocks className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No combos created yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Combos allow you to package a main item, sides, and drinks together at a specific price point.
          </p>
          <div className="mt-6">
            <CreateComboSheet />
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-background overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Combo Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combos.map((combo) => (
                <TableRow key={combo.id}>
                  <TableCell className="font-medium text-foreground">
                    {combo.name}
                    {combo.description && (
                      <div className="text-xs text-muted-foreground font-normal mt-0.5">
                        {combo.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono">
                    ₹{combo.price}
                  </TableCell>
                  <TableCell>
                    <Badge variant={combo.isActive ? 'outline' : 'destructive'}>
                      {combo.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
