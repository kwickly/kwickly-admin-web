import { useState, useEffect } from "react";
import { Package, Plus, Search, Settings2, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export default function Stock() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [filterUOM, setFilterUOM] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaterials = materials.filter(item => {
    if (filterUOM !== "ALL" && item.uom !== filterUOM) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = () => {
    setIsLoading(true);
    // Simulating API Fetch: GET /api/v1/inventory/materials
    // In a real app, the backend calculates currentStock = SUM(quantityChange) from stockLedgers
    setTimeout(() => {
      setMaterials([
        { id: '1', name: 'Premium Flour', uom: 'KG', currentStock: 150.5, lastUpdated: new Date().toISOString() },
        { id: '2', name: 'Mozzarella Cheese', uom: 'KG', currentStock: 25.0, lastUpdated: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', name: 'Pizza Boxes (Large)', uom: 'PIECE', currentStock: 500, lastUpdated: new Date(Date.now() - 86400000).toISOString() },
        { id: '4', name: 'Tomato Sauce', uom: 'LITER', currentStock: 12.5, lastUpdated: new Date().toISOString() },
        { id: '5', name: 'Olive Oil', uom: 'LITER', currentStock: 4.2, lastUpdated: new Date(Date.now() - 172800000).toISOString() },
      ]);
      setIsLoading(false);
    }, 800);
  };

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdjustDialogOpen(false);
    // Refresh table after ledger entry is created
    fetchStock();
  };

  const openAdjustDialog = (material: any) => {
    setSelectedMaterial(material);
    setIsAdjustDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Stock & Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Track raw ingredients, view current stock levels, and make manual ledger adjustments.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="bg-white dark:bg-zinc-900">
            <Settings2 className="h-4 w-4 mr-2" />
            Export Ledger
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Material
          </Button>
        </div>
      </div>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Stock Adjustment</DialogTitle>
            <DialogDescription>
              Create a new double-entry ledger record for <span className="font-bold text-slate-900 dark:text-white">{selectedMaterial?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockAdjustment} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adjustmentType">Adjustment Type</Label>
                <Select defaultValue="CREDIT">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREDIT">Add Stock (Credit)</SelectItem>
                    <SelectItem value="DEBIT">Remove Stock (Debit/Spoilage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity ({selectedMaterial?.uom})</Label>
                <Input id="quantity" type="number" step="0.01" placeholder="e.g. 10.5" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason / Reference</Label>
                <Input id="reason" placeholder="e.g. PO-1024 Arrival, or Spilled" required />
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-3 rounded-md text-xs border border-amber-200 dark:border-amber-900">
              <strong>Audit Trail Notice:</strong> This action creates an immutable ledger entry. It cannot be deleted, only offset by a future entry.
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Submit Ledger Entry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Raw Materials</CardTitle>
            <CardDescription>Current aggregated stock levels for your branch.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Unit of Measure:</span>
              <Select value={filterUOM} onValueChange={setFilterUOM}>
                <SelectTrigger className="w-[130px] bg-slate-50 dark:bg-zinc-900/50">
                  <SelectValue placeholder="UOM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Units</SelectItem>
                  <SelectItem value="KG">Kilogram (KG)</SelectItem>
                  <SelectItem value="GRAM">Gram (G)</SelectItem>
                  <SelectItem value="LITER">Liter (L)</SelectItem>
                  <SelectItem value="MILLILITER">Milliliter (ML)</SelectItem>
                  <SelectItem value="PIECE">Piece (PC)</SelectItem>
                  <SelectItem value="BOX">Box</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials..."
                className="pl-9 w-64 bg-slate-50 dark:bg-zinc-900/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 dark:border-zinc-800 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Name</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No raw materials match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                          {item.uom}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        <span className={item.currentStock < 10 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}>
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(item.lastUpdated).toLocaleDateString()} {new Date(item.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={() => openAdjustDialog(item)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Adjust Stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
