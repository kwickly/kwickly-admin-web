import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TableSkeleton() {
  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex p-4 border-b border-slate-100 dark:border-zinc-800/50 last:border-0 gap-4">
            <Skeleton className="h-6 w-1/4 rounded-md" />
            <Skeleton className="h-6 w-1/4 rounded-md" />
            <Skeleton className="h-6 w-1/4 rounded-md" />
            <Skeleton className="h-6 w-1/4 rounded-md hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden bg-white/80 dark:bg-zinc-900/80 border-slate-200/60 dark:border-zinc-800/60">
          <Skeleton className="h-1 w-full rounded-none" />
          <div className="p-5 flex flex-col h-full space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function DashboardKPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in duration-500">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2 rounded-md" />
            <Skeleton className="h-3 w-3/4 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="h-full w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-slate-200/60 dark:border-zinc-800/60 animate-in fade-in duration-500">
      <CardHeader>
        <Skeleton className="h-6 w-1/3 rounded-md" />
      </CardHeader>
      <CardContent className="h-[300px] flex items-end gap-2 px-6 pb-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="w-full rounded-t-md opacity-50" style={{ height: `${Math.random() * 60 + 20}%` }} />
        ))}
      </CardContent>
    </Card>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/4 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
      </div>
      <Card className="bg-white/80 dark:bg-zinc-900/80 border-slate-200/60 dark:border-zinc-800/60">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <Skeleton className="h-24 w-full rounded-md" />
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
