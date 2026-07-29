import { Icons } from '@/components/shared/icons';
import { PageHeader } from '@/components/ui/page-header';
export default function TenantSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader
        title="Tenant Feature Toggles"
        description="Manually override subscription plans, suspend accounts, and toggle POS features."
        icon={Icons.Sliders}
      />

      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/50">
        <div className="text-center">
          <Icons.Sliders className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Select a Tenant</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Search for a tenant below to view and modify their active feature flags and account status.
          </p>
        </div>
      </div>
    </div>
  );
}
