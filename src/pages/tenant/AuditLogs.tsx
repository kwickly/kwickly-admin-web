import { useState } from 'react';
import { useAuditLogs } from '@/hooks/api/useAuditLogs';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const { data: response, isLoading: loading, error } = useAuditLogs(page, 20);

  const logs = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Security & Audit Logs</h1>
        <p className="text-muted-foreground mt-2">
          Track staff actions and security events across your restaurant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-8">{error instanceof Error ? error.message : "An error occurred"}</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">
                          {log.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {log.userRole?.replace('_', ' ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            log.method === 'DELETE' ? 'destructive' : 
                            log.method === 'POST' ? 'default' : 
                            log.method === 'PATCH' || log.method === 'PUT' ? 'secondary' : 'outline'
                          }
                        >
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.path}
                      </TableCell>
                      <TableCell>
                        <span className={log.statusCode >= 400 ? 'text-destructive font-medium' : 'text-success font-medium'}>
                          {log.statusCode}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {log.ipAddress || 'Unknown'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {meta && (
            <div className="mt-4 border-t border-border pt-4">
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
