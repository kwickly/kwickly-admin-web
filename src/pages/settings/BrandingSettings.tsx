import { Palette } from "lucide-react";

export default function BrandingSettings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            Branding & Colors
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your tenant's appearance and branding.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/50">
        <div className="text-center">
          <Palette className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Self-Service Branding</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Self-service branding customization will be available in a future update. For now, please contact platform support to update your theme.
          </p>
        </div>
      </div>
    </div>
  );
}
