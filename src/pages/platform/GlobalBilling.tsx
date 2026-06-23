import { CreditCard, DollarSign } from "lucide-react";

export default function GlobalBilling() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Global Billing & Revenue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor MRR, handle failed SaaS subscriptions, and manage platform pricing tiers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-border rounded-xl bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total MRR</h3>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold mt-2 text-foreground">$0.00</p>
        </div>
        <div className="p-6 border border-border rounded-xl bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Active Tenants</h3>
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <p className="text-3xl font-bold mt-2 text-foreground">0</p>
        </div>
      </div>

      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/50">
        <div className="text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Stripe Integration Pending</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Connect your Stripe Connect platform account to view live billing data.
          </p>
        </div>
      </div>
    </div>
  );
}
