import { ScrollText, Terminal } from "lucide-react";
import { usePlatformAuditLogs } from "@/hooks/api/usePlatform";
import { TableSkeleton } from "@/components/ui/loaders";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";

export default function PlatformAuditLogs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: response, isLoading: isLogsLoading } = usePlatformAuditLogs(page, 50, search);

  const logs = response?.data || [];
  const meta = response?.meta;

  const getMethodBadgeVariant = (method: string) => {
    switch (method.toUpperCase()) {
      case "POST":
        return "default";
      case "PATCH":
      case "PUT":
        return "secondary";
      case "DELETE":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeClasses = (status?: number) => {
    if (!status) return "bg-muted text-muted-foreground border-border";
    if (status >= 200 && status < 300) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (status >= 400 && status < 500) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    if (status >= 500) return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          System Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          A real-time chronological ledger recording all database mutations.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput 
          value={search} 
          onChange={(val) => { setSearch(val); setPage(1); }} 
          placeholder="Search logs by path or user..." 
          className="w-full max-w-sm"
        />
      </div>

      {isLogsLoading ? (
        <div className="mt-8">
          <TableSkeleton />
        </div>
      ) : !logs || logs.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-xl border border-border">
          <Terminal className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No logs found</h3>
          <p className="text-muted-foreground mt-2">No mutating actions have been recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admin User</TableHead>
                  <TableHead>Tenant Context</TableHead>
                  <TableHead>Device/Browser</TableHead>
                  <TableHead className="text-right">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getMethodBadgeVariant(log.method)} className="font-bold text-[10px]">
                        {log.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground font-semibold max-w-xs truncate">
                      {log.path}
                    </TableCell>
                    <TableCell>
                      {log.statusCode ? (
                        <Badge variant="outline" className={`font-bold text-[10px] ${getStatusBadgeClasses(log.statusCode)}`}>
                          {log.statusCode}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-foreground text-sm">{log.userName}</div>
                        {log.userRole && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                            {log.userRole}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold border-primary/20 text-primary bg-primary/10">
                        {log.tenantName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.userAgent ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help text-left">
                              <div className="max-w-[150px] truncate text-xs text-muted-foreground font-mono">
                                {log.userAgent}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs font-mono break-words">{log.userAgent}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {log.ipAddress || "Local"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {meta && (
            <PaginationControls 
              page={meta.page} 
              totalPages={meta.totalPages} 
              onPageChange={setPage} 
            />
          )}
        </div>
      )}
    </div>
  );
}
