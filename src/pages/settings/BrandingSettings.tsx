import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { getContrastColor, adjustColorBrightness, getHexOpacity } from "@/lib/colors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormSkeleton } from "@/components/ui/loaders";
import { Paintbrush, Image, Check, Layout, Sparkles } from "lucide-react";

export default function BrandingSettings() {
  const queryClient = useQueryClient();
  const { setImpersonatedTenant, impersonatedTenantId } = useAuthStore();

  // 1. Fetch current tenant settings from DB
  const { data: tenantSettings, isLoading } = useQuery({
    queryKey: ["tenant", "settings"],
    queryFn: async () => {
      const { data } = await api.get("/tenant/settings");
      return data.data; // { id, name, brandColor, logoUrl, ... }
    },
  });

  // Local Form States
  const [name, setName] = useState("");
  const [brandColor, setBrandColor] = useState("#4f46e5");
  const [logoUrl, setLogoUrl] = useState("");

  // Sync Form States with fetched data
  useEffect(() => {
    if (tenantSettings) {
      setName(tenantSettings.name || "");
      setBrandColor(tenantSettings.brandColor || "#4f46e5");
      setLogoUrl(tenantSettings.logoUrl || "");
    }
  }, [tenantSettings]);

  // 2. Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: { name: string; brandColor: string; logoUrl: string }) => {
      const { data } = await api.patch("/tenant/settings", payload);
      return data.data;
    },
    onSuccess: (updatedTenant) => {
      toast.success("Branding settings saved successfully!");
      // Invalidate queries to refresh DB settings
      queryClient.invalidateQueries({ queryKey: ["tenant", "settings"] });
      
      // Update Auth Store with new tenant details so app shell re-renders instantly
      if (useAuthStore.getState().user) {
        const currentUser = useAuthStore.getState().user!;
        useAuthStore.setState({
          user: {
            ...currentUser,
            tenantDetails: {
              id: updatedTenant.id,
              name: updatedTenant.name,
              logoUrl: updatedTenant.logoUrl,
              brandColor: updatedTenant.brandColor,
            },
          },
        });
      }

      // If Platform Owner is impersonating, update the impersonation state too
      if (impersonatedTenantId === updatedTenant.id) {
        setImpersonatedTenant(
          updatedTenant.id, 
          updatedTenant.name, 
          updatedTenant.brandColor, 
          updatedTenant.logoUrl
        );
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update branding.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ name, brandColor, logoUrl });
  };

  // Preview derived values
  const previewForeground = getContrastColor(brandColor);
  const previewHover = adjustColorBrightness(brandColor, -12);
  const previewTint = getHexOpacity(brandColor, 10);
  const previewTintHover = getHexOpacity(brandColor, 20);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
      
      {/* Settings Form Column */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Customize Portal Theme
            </CardTitle>
            <CardDescription>
              Set your restaurant name, primary brand colors, and company logo. These will apply across your staff and customer-facing interfaces.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input
                  id="restaurant-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Kwickly Burgers"
                  className="bg-transparent border-slate-200 dark:border-zinc-800 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-color">Primary Brand Color</Label>
                  <div className="flex gap-3">
                    <div 
                      className="h-10 w-12 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-inner cursor-pointer"
                      style={{ backgroundColor: brandColor }}
                      onClick={() => document.getElementById("color-picker")?.click()}
                    />
                    <Input
                      id="brand-color"
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      placeholder="#6366F1"
                      className="font-mono bg-transparent border-slate-200 dark:border-zinc-800 focus:ring-1 focus:ring-indigo-500"
                      maxLength={7}
                      required
                    />
                    <input
                      id="color-picker"
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="sr-only"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Select or type a hex color code representing your brand.</p>
                </div>

                <div className="space-y-2">
                  <Label>Preset Colors</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6", "#09090b"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBrandColor(preset)}
                        className="h-6 w-6 rounded-full border border-white dark:border-zinc-900 shadow-sm transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                        style={{ backgroundColor: preset }}
                      >
                        {brandColor.toLowerCase() === preset.toLowerCase() && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-url" className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-slate-400" />
                  Logo Image URL
                </Label>
                <Input
                  id="logo-url"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="bg-transparent border-slate-200 dark:border-zinc-800 focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-500">Provide an absolute URL pointing to your transparent logo PNG or SVG.</p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saveMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 shadow-sm transition-colors"
                >
                  {saveMutation.isPending ? "Saving changes..." : "Save Branding"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Mockup Column */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden sticky top-24">
          <CardHeader className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layout className="h-4 w-4" /> Live Interactive Mockup
            </CardTitle>
            <CardDescription>
              See how your selected theme details automatically style portal elements.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6 bg-slate-50/30 dark:bg-zinc-950/20">
            
            {/* Sidebar Active Item Simulation */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Navigation Menu Item</span>
              <div 
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-colors shadow-sm"
                style={{ 
                  backgroundColor: previewTint,
                  borderColor: previewTintHover,
                  color: brandColor
                }}
              >
                <div className="h-4 w-4 rounded" style={{ backgroundColor: brandColor }} />
                <span className="text-xs font-semibold">Active Menu Section</span>
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase" style={{ backgroundColor: brandColor, color: previewForeground }}>
                  NEW
                </span>
              </div>
            </div>

            {/* Buttons Preview */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Action Buttons</span>
              <div className="flex flex-wrap gap-3">
                {/* Primary Button */}
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-default"
                  style={{
                    backgroundColor: brandColor,
                    color: previewForeground
                  }}
                >
                  Confirm Action
                </button>

                {/* Hover state simulation */}
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold rounded-lg shadow-md transition-colors cursor-default"
                  style={{
                    backgroundColor: previewHover,
                    color: previewForeground
                  }}
                >
                  Hover State
                </button>

                {/* Tint/Secondary state */}
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-default"
                  style={{
                    backgroundColor: previewTint,
                    borderColor: previewTintHover,
                    color: brandColor
                  }}
                >
                  Secondary Tint
                </button>
              </div>
            </div>

            {/* Dashboard metrics card simulation */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Stats Card Accent</span>
              <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400">Total Live Scans</span>
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: previewTint }}>
                    <Sparkles className="h-4 w-4" style={{ color: brandColor }} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">4,892</span>
                  <span className="text-[10px] font-bold text-emerald-500">+14.2%</span>
                </div>
              </div>
            </div>

            {/* Accessibility / Relative Contrast Indicator */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Accessibility Check</span>
              <div className="p-3 bg-slate-100 dark:bg-zinc-800/50 rounded-lg text-xs flex items-center justify-between border border-slate-200/50 dark:border-zinc-800/40">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-700 dark:text-zinc-200">Text Contrast Contrast</span>
                  <span className="text-[10px] text-slate-500">Calculates luminance automatically</span>
                </div>
                <div 
                  className="px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border shadow-sm"
                  style={{ 
                    backgroundColor: brandColor, 
                    color: previewForeground,
                    borderColor: previewHover
                  }}
                >
                  Contrast: {previewForeground === "#ffffff" ? "Light Text" : "Dark Text"}
                </div>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
