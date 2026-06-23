import { useState, useEffect } from "react";
import { Users, Search, Wallet, History, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerDirectory() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Wallet Modal State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setIsLoading(true);
    // Simulating API Fetch: GET /api/v1/crm/customers
    setTimeout(() => {
      setCustomers([
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '9876543210', walletBalance: 500, lifetimeValue: 2450.00, lastVisit: new Date().toISOString() },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', walletBalance: 0, lifetimeValue: 120.50, lastVisit: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212', walletBalance: 1250, lifetimeValue: 8900.00, lastVisit: new Date(Date.now() - 172800000).toISOString() },
      ]);
      setIsLoading(false);
    }, 800);
  };

  const openWalletModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsWalletModalOpen(true);
  };

  const handleManualAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWalletModalOpen(false);
    // Refresh data
    fetchCustomers();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Customer Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your customer profiles, view lifetime value, and handle wallet balances.
          </p>
        </div>
      </div>

      {/* Wallet Management Modal */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-foreground">
              <Wallet className="h-5 w-5 text-primary" />
              Wallet Management: {selectedCustomer?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              View transaction history and make manual wallet adjustments.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="history" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Transaction History
              </TabsTrigger>
              <TabsTrigger value="adjust">
                <Wallet className="h-4 w-4 mr-2" />
                Manual Adjustment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-4 border border-border rounded-md p-0 overflow-hidden">
              <div className="bg-muted/50 p-4 border-b border-border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Current Balance</span>
                <span className="text-2xl font-bold text-primary">₹{selectedCustomer?.walletBalance.toFixed(2)}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-sm">Today, 10:42 AM</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> CREDIT
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">+₹500.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm">Yesterday, 8:15 PM</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20">
                        <ArrowDownRight className="h-3 w-3 mr-1" /> DEBIT
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-rose-600">-₹120.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="adjust" className="mt-4">
              <form onSubmit={handleManualAdjustment} className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border border-border flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Balance</p>
                    <p className="text-2xl font-bold text-foreground mt-1">₹{selectedCustomer?.walletBalance.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adjustmentType">Transaction Type</Label>
                  <Select defaultValue="CREDIT">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREDIT">Credit (Add Funds)</SelectItem>
                      <SelectItem value="DEBIT">Debit (Deduct Funds)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" type="number" step="0.01" placeholder="e.g. 100.00" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason / Note (Required for auditing)</Label>
                  <Input id="reason" placeholder="e.g. Apology for delayed order" required />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="w-full">
                    Submit Ledger Entry
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Customer Profiles</CardTitle>
            <CardDescription>View and manage all registered customers.</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers by name or phone..."
              className="pl-9 w-72 bg-muted/50"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Lifetime Value</TableHead>
                  <TableHead className="text-right">Wallet Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium text-foreground">
                        {customer.name}
                        <div className="text-xs text-muted-foreground font-normal mt-0.5">Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{customer.phone}</div>
                        <div className="text-xs text-muted-foreground">{customer.email}</div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground font-medium">
                        ₹{customer.lifetimeValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {customer.walletBalance > 0 ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-1">
                            ₹{customer.walletBalance.toFixed(2)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground/50 font-medium">₹0.00</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => openWalletModal(customer)}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Manage Wallet
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
