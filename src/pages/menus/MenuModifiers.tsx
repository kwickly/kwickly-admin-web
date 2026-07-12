import { ListTree } from "lucide-react";
import CreateModifierDialog from "@/features/menus/components/CreateModifierDialog";
import { useAddons } from "@/hooks/api/useMenus";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/loaders";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";

export default function MenuModifiers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: response, isLoading: isAddonsLoading } = useAddons(page, 20, search);

  const addons = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ListTree className="h-6 w-6 text-primary" />
            Menu Modifiers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage global add-ons and modifiers for your menu items.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search modifiers..." 
            className="w-56"
          />
          <CreateModifierDialog />
        </div>
      </div>

      {isAddonsLoading ? (
        <TableSkeleton />
      ) : !addons || addons.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground bg-card rounded-xl border border-border">
          <h3 className="text-lg font-medium text-foreground">No Modifiers</h3>
          <p className="mt-2">Use the "Create Modifier" button to add new global add-ons.</p>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Modifier Name</TableHead>
                <TableHead>Additional Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addons.map((addon) => (
                <TableRow key={addon.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">
                    {addon.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono">
                    ₹{addon.price}
                  </TableCell>
                  <TableCell>
                    <Badge variant={addon.status ? 'outline' : 'destructive'} className={addon.status ? 'border-border text-foreground bg-background' : ''}>
                      {addon.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
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
