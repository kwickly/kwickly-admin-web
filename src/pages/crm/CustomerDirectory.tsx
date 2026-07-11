import { useState } from "react";
import { Users, Search, Wallet, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomers } from "@/hooks/api/useCRM";
import { Link } from "react-router-dom";

export default function CustomerDirectory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCustomers(page, 50);

  const customers = data?.data || [];

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <TableHead className="text-right">Loyalty Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium text-foreground">
                        {customer.name}
                        {customer.marketingOptIn && (
                          <Badge variant="outline" className="ml-2 text-[10px] bg-green-500/10 text-green-600 border-green-500/20">
                            Opt-in
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{customer.phone}</div>
                        <div className="text-xs text-muted-foreground">{customer.email}</div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground font-medium">
                        ₹{parseFloat(customer.lifetimeValue || '0').toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(customer.walletBalance || '0') > 0 ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-1">
                            ₹{parseFloat(customer.walletBalance || '0').toFixed(2)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground/50 font-medium">₹0.00</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {parseFloat(customer.loyaltyPoints || '0')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/crm/customers/${customer.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
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
