import { useState, useEffect } from "react";
import { CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function WalletTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real scenario, this would fetch from the backend:
    // fetch('/api/v1/crm/wallet/history')
    setIsLoading(true);
    setTimeout(() => {
      setTransactions([
        { id: '1', date: new Date().toISOString(), type: 'CREDIT', amount: 500, reason: 'Initial Promo Top-up', customerName: 'John Doe' },
        { id: '2', date: new Date(Date.now() - 86400000).toISOString(), type: 'DEBIT', amount: 150, reason: 'Order #1024 Payment', customerName: 'Jane Smith' },
        { id: '3', date: new Date(Date.now() - 172800000).toISOString(), type: 'CREDIT', amount: 200, reason: 'Refund for Order #1010', customerName: 'Mike Johnson' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Wallet & Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global ledger of all customer wallet credits and debits.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A complete log of all wallet activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No wallet transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-foreground">{tx.customerName}</TableCell>
                      <TableCell>
                        {tx.type === 'CREDIT' ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            CREDIT
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            DEBIT
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tx.reason}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        <span className={tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-destructive'}>
                          {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                        </span>
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
