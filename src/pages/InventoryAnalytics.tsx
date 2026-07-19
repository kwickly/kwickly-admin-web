import { PackageOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useInventoryForecast } from "@/hooks/api/useDashboard";
import { useBranchStore } from "@/store/useBranch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function InventoryAnalytics() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || "default";

  const { data: forecastData, isLoading } = useInventoryForecast(branchId);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <PackageOpen className="h-6 w-6 text-primary" />
            Inventory Forecast
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Predictive stockout analysis based on last 30 days of consumption.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
        <h3 className="font-semibold text-foreground text-base">Stock Depletion Risk</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : !forecastData || forecastData.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2">
            <PackageOpen className="h-10 w-10 opacity-30" />
            <p className="text-sm">No inventory data available for forecasting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {forecastData.map((item) => {
              const isCritical = item.daysRemaining < 3;
              const isWarning = item.daysRemaining >= 3 && item.daysRemaining < 7;
              
              let statusColor = "text-emerald-500";
              let progressColor = "bg-emerald-500";
              let Icon = CheckCircle2;
              
              if (isCritical) {
                statusColor = "text-destructive";
                progressColor = "bg-destructive";
                Icon = AlertTriangle;
              } else if (isWarning) {
                statusColor = "text-amber-500";
                progressColor = "bg-amber-500";
                Icon = AlertTriangle;
              }

              // Cap progress at 100 for > 30 days
              const progressValue = Math.max(0, 100 - (item.daysRemaining / 30) * 100);

              return (
                <div key={item.id} className="flex items-center gap-6 p-4 rounded-lg border border-border bg-muted/30">
                  <div className={`p-3 rounded-full bg-background border ${isCritical ? 'border-destructive/30' : 'border-border'}`}>
                    <Icon className={`h-5 w-5 ${statusColor}`} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <Badge variant={isCritical ? "destructive" : isWarning ? "secondary" : "outline"} className={isWarning ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none' : ''}>
                        {item.daysRemaining === 999 ? '> 30 days' : `${item.daysRemaining.toFixed(1)} days left`}
                      </Badge>
                    </div>
                    
                    <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <div className={`h-full ${progressColor}`} style={{ width: `${progressValue}%` }} />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: {item.currentStock.toFixed(2)} {item.uom}</span>
                      <span>Avg Usage: {item.avgDailyUsage.toFixed(2)} {item.uom}/day</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
