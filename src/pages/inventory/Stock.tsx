import { useState } from "react";
import { Package, Plus, Search, Settings2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useInventoryStock, useAdjustStock } from "@/hooks/api/useInventory";
import { useBranchStore } from "@/store/useBranch";
import { toast } from "sonner";

export default function Stock() {
  const { selectedBranchId } = useBranchStore();
  const { data: stockData = [], isLoading } = useInventoryStock(selectedBranchId);
  const adjustStockMutation = useAdjustStock();

  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [filterUOM, setFilterUOM] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [adjustType, setAdjustType] = useState("CREDIT");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const materials = stockData.map(item => ({
    ...item,
    lastUpdated: new Date().toISOString() // Fallback if backend doesn't send it yet
  }));

  const filteredMaterials = materials.filter(item => {
    if (filterUOM !== "ALL" && item.uom !== filterUOM) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId || !selectedMaterial) return;

    let qtyChange = quantity;
    if (adjustType === "DEBIT") {
      qtyChange = `-${quantity}`; // Make negative for debit
    }

    adjustStockMutation.mutate(
      {
        branchId: selectedBranchId,
        rawMaterialId: selectedMaterial.id,
        quantityChange: qtyChange,
        reason: reason,
      },
      {
        onSuccess: () => {
          toast.success("Stock adjusted successfully!");
          setIsAdjustDialogOpen(false);
          setQuantity("");
          setReason("");
        },
        onError: () => {
          toast.error("Failed to adjust stock.");
        }
      }
    );
  };

  const openAdjustDialog = (material: any) => {
    setSelectedMaterial(material);
    setIsAdjustDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Stock & Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track raw ingredients, view current stock levels, and make manual ledger adjustments.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="h-11 bg-card">
            <Settings2 className="h-4 w-4 mr-2" />
            Export Ledger
          </Button>
          <Button className="h-11">
            <Plus className="h-4 w-4 mr-2" />
            New Material
          </Button>
        </div>
      </div>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Manual Stock Adjustment</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new double-entry ledger record for <span className="font-bold text-foreground">{selectedMaterial?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockAdjustment} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adjustmentType" className="text-foreground">Adjustment Type</Label>
                <Select value={adjustType} onValueChange={setAdjustType}>
                  <SelectTrigger className="h-11 bg-transparent border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="CREDIT">Add Stock (Credit)</SelectItem>
                    <SelectItem value="DEBIT">Remove Stock (Debit/Spoilage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-foreground">Quantity ({selectedMaterial?.uom})</Label>
                <Input id="quantity" type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 10.5" className="h-11 bg-transparent border-border" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-foreground">Reason / Reference</Label>
                <Input id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. PO-1024 Arrival, or Spilled" className="h-11 bg-transparent border-border" required />
              </div>
            </div>
            
            <div className="bg-amber-500/10 text-amber-600 p-3 rounded-md text-xs border border-amber-500/20">
              <strong>Audit Trail Notice:</strong> This action creates an immutable ledger entry. It cannot be deleted, only offset by a future entry.
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="h-11 w-full" disabled={adjustStockMutation.isPending}>
                {adjustStockMutation.isPending ? "Submitting..." : "Submit Ledger Entry"}
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
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Unit of Measure:</span>
              <Select value={filterUOM} onValueChange={(v) => setFilterUOM(v || 'ALL')}>
                <SelectTrigger className="h-11 w-[130px] bg-muted/50 border-border">
                  <SelectValue placeholder="UOM" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
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
              <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials..."
                className="h-11 pl-9 w-64 bg-muted/50 border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border mt-4">
            <Table>
              <TableHeader className="bg-muted/50">
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
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No raw materials match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-background text-muted-foreground border-border">
                          {item.uom}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        <span className={item.currentStock < 10 ? 'text-destructive' : 'text-foreground'}>
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(item.lastUpdated).toLocaleDateString()} {new Date(item.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          className="h-11 px-4 hover:bg-primary/10 hover:text-primary"
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
