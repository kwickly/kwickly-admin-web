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
    if (!status) return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
    if (status >= 200 && status < 300) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50";
    if (status >= 400 && status < 500) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50";
    if (status >= 500) return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/50";
    return "bg-slate-100 text-slate-500 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          System Audit Logs
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
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
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <Terminal className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No logs found</h3>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">No mutating actions have been recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
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
                  <TableRow key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                    <TableCell className="font-mono text-xs text-slate-500 dark:text-zinc-455">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getMethodBadgeVariant(log.method)} className="font-bold text-[10px]">
                        {log.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-900 dark:text-zinc-100 font-semibold max-w-xs truncate">
                      {log.path}
                    </TableCell>
                    <TableCell>
                      {log.statusCode ? (
                        <Badge variant="outline" className={`font-bold text-[10px] ${getStatusBadgeClasses(log.statusCode)}`}>
                          {log.statusCode}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 dark:text-zinc-500 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-slate-900 dark:text-zinc-100 text-sm">{log.userName}</div>
                        {log.userRole && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                            {log.userRole}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{log.userEmail}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-semibold border-indigo-200/50 text-indigo-700 bg-indigo-50/30">
                        {log.tenantName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.userAgent ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help text-left">
                              <div className="max-w-[150px] truncate text-xs text-slate-500 dark:text-zinc-400 font-mono">
                                {log.userAgent}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs font-mono break-words">{log.userAgent}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-slate-400 dark:text-zinc-500 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-slate-500 dark:text-zinc-450">
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
