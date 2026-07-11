import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/useAuth';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Palette, Type, Square, Layout, Image as ImageIcon, CheckCircle2, AlertTriangle } from 'lucide-react';
import { generateOklchTheme } from '@/lib/ThemeGenerator';
import { getContrastColor } from '@/lib/colors';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

type TabType = 'colors' | 'shape' | 'type' | 'assets';

export default function TenantBranding() {
  const { user, token, setImpersonatedTenant } = useAuthStore();

  const currentTheme = user?.tenantDetails?.themeConfig || {
    light: {},
    dark: {},
    fonts: { sans: "Inter, sans-serif", serif: "Georgia, serif", mono: "Menlo, monospace" }
  };

  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [hue, setHue] = useState<number>(245);
  const [chroma, setChroma] = useState<number>(0.16);
  const [radius, setRadius] = useState<number>(0.5);
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

  // Compute the live preview theme config using the powerful ThemeGenerator!
  const previewTheme = useMemo(() => {
    const generated = generateOklchTheme(hue, chroma);
    return {
      light: { ...generated.light, '--radius': `${radius}rem` },
      dark:  { ...generated.dark,  '--radius': `${radius}rem` },
      fonts: {
        sans:  fontSans,
        serif: currentTheme.fonts?.serif || 'Georgia, serif',
        mono:  currentTheme.fonts?.mono  || 'Menlo, monospace',
      }
    };
  }, [hue, chroma, radius, fontSans, currentTheme.fonts]);

  // Derive the approximate hex of the primary color for the contrast check.
  // The primary is oklch(0.55 chroma hue) in light mode — we check whether
  // it meets a minimum 3:1 ratio against a white card surface.
  // We use a simple luminance approximation: primary lightness 0.55 in OKLCH
  // maps to roughly L^2.2 in relative luminance. Low chroma shifts toward gray.
  const primaryLightness = 0.55; // fixed by ThemeGenerator light mode
  const primaryLuminance = Math.pow(primaryLightness, 2.2);
  const whiteLuminance   = 1.0;
  const contrastRatio    = (whiteLuminance + 0.05) / (primaryLuminance + 0.05);
  const contrastIsValid  = contrastRatio >= 3.0;

  // Derive a preview swatch color string for the live indicator
  const swatchStyle = `oklch(0.55 ${chroma} ${hue})`;
  const swatchFg    = getContrastColor(
    // Approximate hex from oklch for contrast decision: use YIQ on chroma=0 approx
    chroma < 0.05 ? '#808080' : primaryLuminance > 0.3 ? '#111111' : '#ffffff'
  );

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
        ${Object.entries(previewTheme.light).map(([k, v]) => `${k}: ${v};`).join('\n        ')}
        --font-sans: ${previewTheme.fonts.sans};
      }
      .dark .theme-preview-container {
        ${Object.entries(previewTheme.dark).map(([k, v]) => `${k}: ${v};`).join('\n        ')}
      }
    `;

    return () => {
      if (style) style.remove();
    };
  }, [previewTheme]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Phase 2: Validate brand color contrast before allowing publish
      if (!contrastIsValid) {
        toast.error('Color contrast too low', {
          description: 'Your primary color does not meet the minimum 3:1 contrast ratio against a white background. Increase the Color Intensity (Chroma) or choose a darker hue.'
        });
        throw new Error('Contrast validation failed — publish blocked.');
      }

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
    onSuccess: () => {
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
    onError: (err: any) => {
      if (err?.message?.includes('Contrast validation')) return; // already toasted
      console.error(err);
      toast.error("Error", { description: "Could not save theme configuration." });
    }
  });

  return (
      <div className="flex flex-col xl:flex-row gap-10 items-start w-full">
        
        {/* Left Settings Sidebar & Controls */}
        <div className="flex flex-col md:flex-row gap-6 w-full lg:w-[480px] shrink-0">
          
          {/* Vertical Navigation (Classic Trendy UI) */}
          <div className="w-full md:w-32 shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setActiveTab('colors')}
              className={`flex flex-col md:flex-row items-center md:justify-start gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'colors' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
            >
              <Palette className="w-4 h-4" /> <span>Colors</span>
            </button>
            <button 
              onClick={() => setActiveTab('shape')}
              className={`flex flex-col md:flex-row items-center md:justify-start gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'shape' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
            >
              <Square className="w-4 h-4" /> <span>Shape</span>
            </button>
            <button 
              onClick={() => setActiveTab('type')}
              className={`flex flex-col md:flex-row items-center md:justify-start gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'type' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
            >
              <Type className="w-4 h-4" /> <span>Type</span>
            </button>
            <button 
              onClick={() => setActiveTab('assets')}
              className={`flex flex-col md:flex-row items-center md:justify-start gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'assets' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
            >
              <ImageIcon className="w-4 h-4" /> <span>Assets</span>
            </button>
          </div>

          {/* Form Container */}
          <div className="flex-1 bg-card border border-border shadow-sm rounded-xl p-6">
            
            {activeTab === 'colors' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Primary Hue</Label>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">{Math.round(hue)}</span>
                  </div>
                  <Slider
                    value={[hue]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(v: any) => setHue(Array.isArray(v) ? v[0] : v)}
                    className="cursor-grab active:cursor-grabbing"
                  />
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 opacity-50" />

                  {/* Live primary color swatch + contrast indicator */}
                  <div className="flex items-center gap-3 mt-3">
                    <div
                      className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: swatchStyle, color: swatchFg }}
                    >
                      Aa
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
                      contrastIsValid
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {contrastIsValid
                        ? <CheckCircle2 className="h-3.5 w-3.5" />
                        : <AlertTriangle className="h-3.5 w-3.5" />}
                      {contrastIsValid
                        ? `${contrastRatio.toFixed(1)}:1 — Meets WCAG AA`
                        : `${contrastRatio.toFixed(1)}:1 — Contrast too low`}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Color Intensity (Chroma)</Label>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">{chroma.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[chroma]}
                    min={0}
                    max={0.3}
                    step={0.01}
                    onValueChange={(v: any) => setChroma(Array.isArray(v) ? v[0] : v)}
                    className="cursor-grab active:cursor-grabbing"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Grayscale</span>
                    <span>Vibrant</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <Label className="text-sm font-semibold">Appearance Mode</Label>
                  <Select value={themeMode} onValueChange={(v) => setThemeMode(v || 'system')}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System Default</SelectItem>
                      <SelectItem value="light">Always Light</SelectItem>
                      <SelectItem value="dark">Always Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeTab === 'shape' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Global Border Radius</Label>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">{radius}rem</span>
                  </div>
                  <Slider
                    value={[radius]}
                    min={0}
                    max={2}
                    step={0.1}
                    onValueChange={(v: any) => setRadius(Array.isArray(v) ? v[0] : v)}
                    className="cursor-grab active:cursor-grabbing"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0rem (Sharp)</span>
                    <span>2rem (Pill)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'type' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Primary Font (Sans-Serif)</Label>
                  <Select value={fontSans} onValueChange={(v) => setFontSans(v || 'Inter, sans-serif')}>
                    <SelectTrigger className="h-10">
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
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Logo (Light Mode)</Label>
                  <Input 
                    className="h-10"
                    value={logoUrl} 
                    onChange={(e) => setLogoUrl(e.target.value)} 
                    placeholder="https://example.com/logo-light.svg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Logo (Dark Mode)</Label>
                  <Input 
                    className="h-10"
                    value={logoDarkUrl} 
                    onChange={(e) => setLogoDarkUrl(e.target.value)} 
                    placeholder="https://example.com/logo-dark.svg" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Favicon</Label>
                  <Input 
                    className="h-10"
                    value={faviconUrl} 
                    onChange={(e) => setFaviconUrl(e.target.value)} 
                    placeholder="https://example.com/favicon.ico" 
                  />
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-border/50">
              <Button 
                onClick={() => saveMutation.mutate()} 
                disabled={saveMutation.isPending}
                className="w-full h-11 text-base font-semibold shadow-sm"
              >
                {saveMutation.isPending ? "Publishing Engine..." : "Publish Theme Engine"}
              </Button>
            </div>

          </div>
        </div>

        {/* Right Pane: Live Interactive Preview */}
        <div className="flex-1 w-full relative">
          
          <div className="sticky top-24 rounded-2xl border border-border/60 bg-muted/20 shadow-2xl overflow-hidden theme-preview-container ring-1 ring-border/50 transition-all duration-300">
            {/* Mac OS Window Header */}
            <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm p-3.5 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-sm" />
              </div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase flex items-center gap-1.5">
                <Layout className="w-3 h-3" /> Live UI Mockup
              </div>
              <div className="w-10" />
            </div>

            <div className="p-8 space-y-8 bg-background h-full min-h-[600px] text-foreground font-sans">
              
              {/* Top Stat Row */}
              <div className="grid grid-cols-2 gap-5">
                <Card className="shadow-sm border-border/50 bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground tracking-tight">$45,231.89</div>
                    <p className="text-xs mt-1 text-primary flex items-center font-semibold">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-border/50 bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground tracking-tight">+2,350</div>
                    <p className="text-xs mt-1 text-muted-foreground flex items-center">
                      +180 new this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Components */}
              <Card className="shadow-sm border-border/50 bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Interactive Elements</CardTitle>
                  <CardDescription>Hover and click to test your theme's physics and responses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  <div className="flex flex-wrap gap-3">
                    <Button className="shadow-sm h-10 px-5 transition-transform active:scale-95">Primary Action</Button>
                    <Button variant="secondary" className="shadow-sm h-10 px-5 transition-transform active:scale-95">Secondary</Button>
                    <Button variant="outline" className="shadow-sm bg-background h-10 px-5 transition-transform active:scale-95">Outline</Button>
                    <Button variant="ghost" className="h-10 px-5">Ghost Style</Button>
                  </div>

                  <div className="space-y-2.5 pt-6 border-t border-border/50">
                    <Label className="text-sm font-medium">Email Address</Label>
                    <div className="flex gap-3">
                      <Input placeholder="m@example.com" className="max-w-xs shadow-sm h-10 bg-background" />
                      <Button className="h-10 px-6 shadow-sm">Subscribe</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">This simulates a standard form input field.</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new products.</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                  </div>

                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
  );
}
