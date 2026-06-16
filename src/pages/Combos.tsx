import { Blocks } from "lucide-react";
import CreateComboSheet from "@/features/combos/components/CreateComboSheet";
import { useCombos } from "@/hooks/api/useCombos";
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
  const { data: combos, isLoading } = useCombos('default');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Blocks className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Combo Meals
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Group existing menu items into meal combos with custom pricing.
          </p>
        </div>
        <CreateComboSheet />
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">Loading combos...</div>
      ) : !combos || combos.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <Blocks className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No combos created yet</h3>
          <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto">
            Combos allow you to package a main item, sides, and drinks together at a specific price point.
          </p>
          <div className="mt-6">
            <CreateComboSheet />
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Combo Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combos.map((combo) => (
                <TableRow key={combo.id}>
                  <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                    {combo.name}
                    {combo.description && (
                      <div className="text-xs text-slate-500 font-normal mt-0.5">
                        {combo.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 font-mono">
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
