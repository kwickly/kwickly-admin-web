import { Icons } from '@/components/shared/icons';
import { PageHeader } from '@/components/ui/page-header';
export default function BrandingSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <PageHeader
        title="Branding & Colors"
        description="Customize your tenant's appearance and branding."
        icon={Icons.Palette}
      />

      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/50">
        <div className="text-center">
          <Icons.Palette className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Self-Service Branding</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Self-service branding customization will be available in a future update. For now, please contact platform support to update your theme.
          </p>
        </div>
      </div>
    </div>
  );
}
