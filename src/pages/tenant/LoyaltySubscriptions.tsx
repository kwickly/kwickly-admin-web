import { useCustomerSubscriptions } from '@/hooks/api/useCustomerSubscriptions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, PauseCircle, PlayCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function LoyaltySubscriptions() {
  const { data: subscriptions, loading, error, updateStatus } = useCustomerSubscriptions();

  const handleStatusChange = async (id: string, status: 'active' | 'paused' | 'cancelled') => {
    await updateStatus(id, status);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Loyalty & Subscriptions</h1>
        <p className="text-muted-foreground mt-2">
          Manage your customers' meal plans and loyalty programs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-8">{error}</div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active customer subscriptions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="font-medium text-primary">{sub.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{sub.customer.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{sub.plan.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {sub.plan.mealType}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={sub.status === 'active' ? 'default' : sub.status === 'paused' ? 'secondary' : 'destructive'}
                          className="capitalize"
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {sub.balanceRemaining} / {sub.totalMeals}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(sub.expiresAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {sub.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="default" 
                            className="min-h-[44px] min-w-[44px]"
                            onClick={() => handleStatusChange(sub.id, 'paused')}
                            title="Pause Subscription"
                          >
                            <PauseCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {sub.status === 'paused' && (
                          <Button 
                            variant="outline" 
                            size="default" 
                            className="min-h-[44px] min-w-[44px]"
                            onClick={() => handleStatusChange(sub.id, 'active')}
                            title="Resume Subscription"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {(sub.status === 'active' || sub.status === 'paused') && (
                          <Button 
                            variant="destructive" 
                            size="default"
                            className="min-h-[44px] min-w-[44px]"
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this subscription?')) {
                                handleStatusChange(sub.id, 'cancelled');
                              }
                            }}
                            title="Cancel Subscription"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
