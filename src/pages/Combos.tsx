import { Icons } from '@/components/shared/icons';
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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

export default function Combos() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';
  
  const { data: combos, isLoading } = useCombos(branchId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader 
        title="Combo Meals"
        description="Group existing menu items into meal combos with custom pricing."
        icon={Icons.Blocks}
      >
        <CreateComboSheet />
      </PageHeader>

      {isLoading ? (
        <GridCardSkeleton count={4} />
      ) : !combos || combos.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-xl border border-border">
          <Icons.Blocks className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
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
                  <TableCell className="text-muted-foreground font-mono text-right">
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
