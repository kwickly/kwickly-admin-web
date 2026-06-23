import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/useAuth';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Palette, Type, Square, Layout, Moon, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export default function BrandingSettings() {
  const { user, token, setImpersonatedTenant } = useAuthStore();

  const currentTheme = user?.tenantDetails?.themeConfig || {
    light: {},
    dark: {},
    fonts: { sans: "Inter, sans-serif", serif: "Georgia, serif", mono: "Menlo, monospace" }
  };

  // State for Advanced Theme Builder
  const [hue, setHue] = useState<number>(245); // Default indigo hue
  const [chroma, setChroma] = useState<number>(0.16); // Default saturation
  const [radius, setRadius] = useState<number>(0.5); // Default radius in rem
  const [fontSans, setFontSans] = useState<string>(currentTheme.fonts?.sans || 'Inter, sans-serif');
  const [themeMode, setThemeMode] = useState<string>(user?.tenantDetails?.themeMode || 'system');
  const [logoUrl, setLogoUrl] = useState(user?.tenantDetails?.logoUrl || '');
  const [logoDarkUrl, setLogoDarkUrl] = useState(user?.tenantDetails?.logoDarkUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(user?.tenantDetails?.faviconUrl || '');

  // Extract initial Hue/Chroma if previously saved
  useEffect(() => {
    const primary = currentTheme.light?.['--primary'];
    if (primary && primary.includes('oklch')) {
      const match = primary.match(/oklch\([.\d]+\s+([.\d]+)\s+([.\d]+)\)/);
      if (match) {
        setChroma(parseFloat(match[1]));
        setHue(parseFloat(match[2]));
      }
    }
    const storedRadius = currentTheme.light?.['--radius'];
    if (storedRadius) {
      setRadius(parseFloat(storedRadius.replace('rem', '')));
    }
  }, []);

  // Compute the live preview theme config
  const previewTheme = {
    light: {
      '--primary': `oklch(0.6723 ${chroma} ${hue})`,
      '--ring': `oklch(0.6818 ${chroma} ${hue})`,
      '--sidebar-primary': `oklch(0.6723 ${chroma} ${hue})`,
      '--radius': `${radius}rem`,
    },
    dark: {
      '--primary': `oklch(0.6692 ${chroma} ${hue})`,
      '--ring': `oklch(0.6818 ${chroma} ${hue})`,
      '--sidebar-primary': `oklch(0.6818 ${chroma} ${hue})`,
    },
    fonts: {
      sans: fontSans,
      serif: currentTheme.fonts?.serif || 'Georgia, serif',
      mono: currentTheme.fonts?.mono || 'Menlo, monospace',
    }
  };

  // Inject preview CSS specifically scoped to the preview container
  useEffect(() => {
    const styleId = 'tweakcn-preview-style';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = `
      .theme-preview-container {
        ${Object.entries(previewTheme.light).map(([k, v]) => `${k}: ${v};`).join('\\n        ')}
        --font-sans: ${previewTheme.fonts.sans};
      }
      .dark .theme-preview-container {
        ${Object.entries(previewTheme.dark).map(([k, v]) => `${k}: ${v};`).join('\\n        ')}
      }
    `;

    return () => {
      if (style) style.remove();
    };
  }, [previewTheme]);


  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        themeConfig: previewTheme,
        themeMode,
        logoUrl,
        logoDarkUrl,
        faviconUrl
      };
      const res = await axios.patch(`${API_URL}/tenant/settings`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Sync the new theme immediately into global app state so it applies platform-wide
      setImpersonatedTenant(
        user!.tenantId,
        user!.tenantDetails!.name,
        user!.tenantDetails!.brandColor,
        logoUrl,
        logoDarkUrl,
        faviconUrl,
        themeMode,
        previewTheme
      );
      toast.success("Theme Published!", { description: "Your Advanced Theme has been saved and applied globally." });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error", { description: "Could not save theme configuration." });
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Left Pane: Tweakcn-style Advanced Controls */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Theme Builder</h2>
          <p className="text-muted-foreground text-sm">Fine-tune your brand's aesthetics using our advanced design engine.</p>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="colors"><Palette className="h-4 w-4 mr-2" /> Colors</TabsTrigger>
            <TabsTrigger value="geometry"><Square className="h-4 w-4 mr-2" /> Shape</TabsTrigger>
            <TabsTrigger value="typography"><Type className="h-4 w-4 mr-2" /> Type</TabsTrigger>
            <TabsTrigger value="assets"><ImageIcon className="h-4 w-4 mr-2" /> Assets</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                
                {/* COLORS TAB */}
                <TabsContent value="colors" className="m-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Primary Hue</Label>
                      <span className="text-xs text-muted-foreground font-mono">{Math.round(hue)}</span>
                    </div>
                    <Slider
                      value={[hue]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(v) => setHue(v[0])}
                      className="[&_[role=slider]]:bg-primary"
                    />
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 opacity-50" />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Color Intensity (Chroma)</Label>
                      <span className="text-xs text-muted-foreground font-mono">{chroma.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[chroma]}
                      min={0}
                      max={0.3}
                      step={0.01}
                      onValueChange={(v) => setChroma(v[0])}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="text-sm font-semibold">Appearance Mode</Label>
                    <Select value={themeMode} onValueChange={setThemeMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System Default</SelectItem>
                        <SelectItem value="light">Always Light</SelectItem>
                        <SelectItem value="dark">Always Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* GEOMETRY TAB */}
                <TabsContent value="geometry" className="m-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Border Radius</Label>
                      <span className="text-xs text-muted-foreground font-mono">{radius}rem</span>
                    </div>
                    <Slider
                      value={[radius]}
                      min={0}
                      max={2}
                      step={0.1}
                      onValueChange={(v) => setRadius(v[0])}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>0rem (Sharp)</span>
                      <span>2rem (Pill)</span>
                    </div>
                  </div>
                </TabsContent>

                {/* TYPOGRAPHY TAB */}
                <TabsContent value="typography" className="m-0 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold">Primary Font (Sans-Serif)</Label>
                    <Select value={fontSans} onValueChange={setFontSans}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, sans-serif">Inter (Modern)</SelectItem>
                        <SelectItem value="Roboto, sans-serif">Roboto (Clean)</SelectItem>
                        <SelectItem value="'Open Sans', sans-serif">Open Sans (Friendly)</SelectItem>
                        <SelectItem value="ui-sans-serif, system-ui, sans-serif">System UI (Native)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* ASSETS TAB */}
                <TabsContent value="assets" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Logo (Light Mode)</Label>
                    <Input 
                      value={logoUrl} 
                      onChange={(e) => setLogoUrl(e.target.value)} 
                      placeholder="https://example.com/logo-light.svg" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Logo (Dark Mode)</Label>
                    <Input 
                      value={logoDarkUrl} 
                      onChange={(e) => setLogoDarkUrl(e.target.value)} 
                      placeholder="https://example.com/logo-dark.svg" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Favicon</Label>
                    <Input 
                      value={faviconUrl} 
                      onChange={(e) => setFaviconUrl(e.target.value)} 
                      placeholder="https://example.com/favicon.ico" 
                    />
                  </div>
                </TabsContent>

              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => saveMutation.mutate()} 
                disabled={saveMutation.isPending}
                className="w-full sm:w-auto shadow-sm"
              >
                {saveMutation.isPending ? "Publishing Theme..." : "Publish Theme Engine"}
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Right Pane: Live Interactive Preview */}
      <div className="lg:col-span-7">
        <div className="sticky top-24 rounded-xl border border-border bg-background shadow-sm overflow-hidden theme-preview-container transition-all duration-300">
          <div className="border-b border-border bg-muted/30 p-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
              <Layout className="w-3 h-3" /> Live UI Mockup
            </div>
            <div className="w-10" />
          </div>

          <div className="p-8 space-y-8 bg-background">
            
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$45,231.89</div>
                  <p className="text-xs text-muted-foreground mt-1 text-primary flex items-center font-medium">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">+2,350</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    +180 new this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Components */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Interactive Elements</CardTitle>
                <CardDescription>Hover and click to test your theme's physics and responses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex flex-wrap gap-4">
                  <Button className="shadow-sm">Primary Action</Button>
                  <Button variant="secondary" className="shadow-sm">Secondary</Button>
                  <Button variant="outline" className="shadow-sm">Outline</Button>
                  <Button variant="ghost">Ghost Style</Button>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <Label>Email Address</Label>
                  <div className="flex gap-3">
                    <Input placeholder="m@example.com" className="max-w-sm shadow-sm" />
                    <Button>Subscribe</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">This simulates a standard form input field.</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new products.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
