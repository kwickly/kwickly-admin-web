import { ScrollText, Terminal } from "lucide-react";
import { usePlatformAuditLogs } from "@/hooks/api/usePlatform";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PlatformAuditLogs() {
  const { data: logs, isLoading } = usePlatformAuditLogs();

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

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading audit logs...</div>
      ) : !logs || logs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <Terminal className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No logs found</h3>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">No mutating actions have been recorded yet.</p>
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Admin User</TableHead>
                <TableHead>Tenant Context</TableHead>
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
                    <div className="font-medium text-slate-900 dark:text-zinc-100 text-sm">{log.userName}</div>
                    <div className="text-xs text-slate-500">{log.userEmail}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-semibold border-indigo-200/50 text-indigo-700 bg-indigo-50/30">
                      {log.tenantName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-slate-500 dark:text-zinc-450">
                    {log.ipAddress || "Local"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
