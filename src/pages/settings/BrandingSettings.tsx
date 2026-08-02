import { Icons } from '@/components/shared/icons';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function BrandingSettings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <PageHeader
        title="Branding & Colors"
        description="Customize your tenant's appearance and branding."
        icon={Icons.Palette}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <Card className="border border-border bg-card shadow-sm flex flex-col flex-1">
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
              <CardDescription>Select the primary and secondary colors for your storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Color Picker */}
                <div className="space-y-2">
                  <Label className="text-foreground">Primary Brand Color</Label>
                  <p className="text-xs text-muted-foreground mb-2">Used for primary buttons, active states, and highlights.</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md border border-border shadow-sm bg-primary" />
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background">
                      #E11D48
                    </div>
                  </div>
                </div>

                {/* Secondary Color Picker */}
                <div className="space-y-2">
                  <Label className="text-foreground">Secondary / Platform Color</Label>
                  <p className="text-xs text-muted-foreground mb-2">Used for secondary actions and subtle background accents.</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md border border-border shadow-sm bg-secondary" />
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background">
                      #3B82F6
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-6">
                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-4">Preset Themes</h3>
                <div className="flex gap-4 flex-wrap">
                  {/* Preset 1 */}
                  <div className="cursor-pointer group flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden flex shadow-sm transition-transform group-hover:scale-105">
                      <div className="h-full w-1/2 bg-red-600" />
                      <div className="h-full w-1/2 bg-slate-900" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Kwickly</span>
                  </div>
                  {/* Preset 2 */}
                  <div className="cursor-pointer group flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full border-2 border-border overflow-hidden flex shadow-sm transition-transform group-hover:scale-105">
                      <div className="h-full w-1/2 bg-emerald-600" />
                      <div className="h-full w-1/2 bg-emerald-950" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Nature</span>
                  </div>
                   {/* Preset 3 */}
                   <div className="cursor-pointer group flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full border-2 border-border overflow-hidden flex shadow-sm transition-transform group-hover:scale-105">
                      <div className="h-full w-1/2 bg-amber-500" />
                      <div className="h-full w-1/2 bg-slate-800" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Sunset</span>
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 flex justify-end shrink-0 mt-auto">
              <Button type="button">
                Save Theme
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col h-full">
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.ImageIcon className="h-5 w-5 text-muted-foreground" />
                Logos & Assets
              </CardTitle>
              <CardDescription>Manage your brand imagery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              
              <div className="space-y-3">
                <Label className="text-foreground">Primary Logo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                  <Icons.UploadCloud className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-medium text-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground text-center mt-1">PNG, JPG or SVG (max 2MB)</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <Label className="text-foreground">App Icon (Favicon)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                  <Icons.ImagePlus className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-medium text-foreground">Upload Icon</p>
                  <p className="text-xs text-muted-foreground text-center mt-1">Square format, at least 512x512px</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
