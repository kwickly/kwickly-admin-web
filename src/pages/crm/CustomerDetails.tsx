import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Wallet, Star, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useCustomerProfile, useAdjustWallet, useAdjustLoyalty } from "@/hooks/api/useCRM";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading } = useCustomerProfile(id!);
  
  const adjustWalletMutation = useAdjustWallet(id!);
  const adjustLoyaltyMutation = useAdjustLoyalty(id!);

  // Modals state
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [reason, setReason] = useState("");

  const handleWalletAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !reason) return;
    
    await adjustWalletMutation.mutateAsync({ amount, type, reason });
    setIsWalletModalOpen(false);
    setAmount("");
    setReason("");
    setType("CREDIT");
  };

  const handleLoyaltyAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !reason) return;
    
    // Loyalty has no CREDIT/DEBIT type enum in payload, just positive/negative points string
    const pointsStr = type === 'DEBIT' ? `-${amount}` : amount;
    
    await adjustLoyaltyMutation.mutateAsync({ points: pointsStr, reason });
    setIsLoyaltyModalOpen(false);
    setAmount("");
    setReason("");
    setType("CREDIT");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Customer not found</h1>
        <Link to="/crm/directory">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/crm/directory" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Customer Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {/* The users table isn't joined for the name in `getCustomerProfile` directly inside crm.service in this simplified view, we'll just display User ID for MVP or you can assume the API returns it */}
            Customer ID: {customer.userId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Info Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marketing Opt-in</p>
              <p className="text-base font-semibold">{customer.marketingOptIn ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lifetime Value</p>
              <p className="text-base font-semibold">₹{parseFloat(customer.lifetimeValue || '0').toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p className="text-base font-semibold">{customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Anniversary</p>
              <p className="text-base font-semibold">{customer.anniversaryDate ? new Date(customer.anniversaryDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Ledgers Card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Ledgers & Balances</CardTitle>
            <CardDescription>Manage wallet and loyalty points.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="wallet"><Wallet className="h-4 w-4 mr-2"/> Wallet</TabsTrigger>
                <TabsTrigger value="loyalty"><Star className="h-4 w-4 mr-2"/> Loyalty</TabsTrigger>
              </TabsList>
              
              {/* Wallet Tab */}
              <TabsContent value="wallet" className="mt-4 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Balance</p>
                    <p className="text-2xl font-bold text-foreground mt-1">₹{parseFloat(customer.walletBalance || '0').toFixed(2)}</p>
                  </div>
                  <Button onClick={() => setIsWalletModalOpen(true)}>Adjust Wallet</Button>
                </div>

                <div className="border border-border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.walletTransactions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No transactions found.</TableCell>
                        </TableRow>
                      )}
                      {customer.walletTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-sm">{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">
                            {tx.reason}
                            <div className="mt-1">
                              {tx.type === 'CREDIT' ? (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">CREDIT</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">DEBIT</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={`text-right font-medium ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Loyalty Tab */}
              <TabsContent value="loyalty" className="mt-4 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Points</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{parseFloat(customer.loyaltyPointsBalance || '0').toFixed(0)}</p>
                  </div>
                  <Button onClick={() => setIsLoyaltyModalOpen(true)}>Adjust Points</Button>
                </div>

                <div className="border border-border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.loyaltyLedgers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-4">No loyalty history found.</TableCell>
                        </TableRow>
                      )}
                      {customer.loyaltyLedgers.map((tx) => {
                        const pts = parseFloat(tx.points);
                        const isCredit = pts > 0;
                        return (
                          <TableRow key={tx.id}>
                            <TableCell className="text-sm">{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm">{tx.reason}</TableCell>
                            <TableCell className={`text-right font-medium ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isCredit ? '+' : ''}{pts.toFixed(0)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Adjust Wallet Modal */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
            <DialogDescription>Manually credit or debit funds to this customer's wallet.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWalletAdjustment} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
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
              <Label>Amount (₹)</Label>
              <Input type="number" step="0.01" min="0" required value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason (Required)</Label>
              <Input required value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={adjustWalletMutation.isPending}>
                {adjustWalletMutation.isPending ? 'Submitting...' : 'Submit Adjustment'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Adjust Loyalty Modal */}
      <Dialog open={isLoyaltyModalOpen} onOpenChange={setIsLoyaltyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Loyalty Points</DialogTitle>
            <DialogDescription>Manually add or remove loyalty points for this customer.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLoyaltyAdjustment} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDIT">Add Points</SelectItem>
                  <SelectItem value="DEBIT">Remove Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Points (Absolute Value)</Label>
              <Input type="number" step="1" min="1" required value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason (Required)</Label>
              <Input required value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={adjustLoyaltyMutation.isPending}>
                {adjustLoyaltyMutation.isPending ? 'Submitting...' : 'Submit Adjustment'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
