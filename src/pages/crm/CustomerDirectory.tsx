import { Icons } from '@/components/shared/icons';
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { PageHeader } from "@/components/ui/page-header";
import { useCustomers } from "@/hooks/api/useCRM";
import { Link } from "react-router-dom";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function CustomerDirectory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCustomers(page, 20);

  const customers = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader 
        title="Customer Directory"
        description="Manage your customer profiles, view lifetime value, and handle wallet balances."
        icon={Icons.Users}
      />

      <div className="flex items-center justify-end gap-4">
        <SearchInput 
          value={search} 
          onChange={(val) => { setSearch(val); setPage(1); }} 
          placeholder="Search customers by name or phone..." 
          className="w-full max-w-sm"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-2">
            <CardTitle>Customer Profiles</CardTitle>
            <CardDescription>View and manage all registered customers.</CardDescription>
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
                  <TableHead className="text-right">Balance</TableHead>
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
                          <Badge variant="outline" className="ml-2 text-[10px] bg-success/10 text-success border-success/20">
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
                          <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 font-bold px-2 py-2">
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
                            variant="outline" 
                            size="default" 
                            className="hover:bg-secondary/10 hover:text-secondary"
                          >
                            Details
                            <Icons.ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {meta && (
            <div className="mt-4">
              <PaginationControls 
                page={meta.page} 
                totalPages={meta.totalPages} 
                onPageChange={setPage} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
