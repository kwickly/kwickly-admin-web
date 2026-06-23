import { Settings } from "lucide-react";

export default function PlatformSettings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Platform Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure system-wide integrations, SMTP servers, and white-labeling.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/50">
        <div className="text-center">
          <Settings className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Global Settings Configuration</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            System settings are currently managed via environment variables. Admin UI override features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
