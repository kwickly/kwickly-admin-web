import { Sliders } from "lucide-react";

export default function TenantSettings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sliders className="h-6 w-6 text-primary" />
            Tenant Feature Toggles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manually override subscription plans, suspend accounts, and toggle POS features.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/50">
        <div className="text-center">
          <Sliders className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Select a Tenant</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Search for a tenant below to view and modify their active feature flags and account status.
          </p>
        </div>
      </div>
    </div>
  );
}
