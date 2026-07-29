import { Icons } from '@/components/shared/icons';
import { useState, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generateOklchTheme } from '@/lib/ThemeGenerator';
import { getContrastColor } from '@/lib/colors';
import { toast } from 'sonner';

type TabType = 'colors' | 'shape' | 'type';

interface Props {
  isDark: boolean;
}

const DEFAULTS = { hue: 26.6, chroma: 0.203, radius: 0.5, fontSans: 'Poppins, sans-serif' };

export function TokenEditorSidebar({ isDark }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [hue, setHue] = useState(DEFAULTS.hue);
  const [chroma, setChroma] = useState(DEFAULTS.chroma);
  const [radius, setRadius] = useState(DEFAULTS.radius);
  const [fontSans, setFontSans] = useState(DEFAULTS.fontSans);

  // Compute preview theme — same as TenantBranding.tsx
  const previewTheme = useMemo(() => {
    const generated = generateOklchTheme(hue, chroma);
    return {
      light: { ...generated.light, '--radius': `${radius}rem` },
      dark: { ...generated.dark, '--radius': `${radius}rem` },
    };
  }, [hue, chroma, radius]);

  // Contrast check — same logic as TenantBranding.tsx
  const primaryLightness = 0.55;
  const primaryLuminance = Math.pow(primaryLightness, 2.2);
  const contrastRatio = (1.05) / (primaryLuminance + 0.05);
  const contrastIsValid = contrastRatio >= 3.0;

  const swatchStyle = `oklch(0.55 ${chroma} ${hue})`;
  const swatchFg = getContrastColor(
    chroma < 0.05 ? '#808080' : primaryLuminance > 0.3 ? '#111111' : '#ffffff'
  );

  // Inject scoped CSS vars to .design-system-root — same mechanism as TenantBranding
  useEffect(() => {
    const styleId = 'design-system-token-overrides';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    const lightVars = Object.entries(previewTheme.light).map(([k, v]) => `${k}: ${v};`).join('\n        ');
    const darkVars = Object.entries(previewTheme.dark).map(([k, v]) => `${k}: ${v};`).join('\n        ');

    style.innerHTML = `
      .design-system-root {
        ${lightVars}
        --font-sans: ${fontSans};
      }
      .design-system-root.dark {
        ${darkVars}
        --font-sans: ${fontSans};
      }
    `;

    return () => { style?.remove(); };
  }, [previewTheme, fontSans]);

  const handleReset = () => {
    setHue(DEFAULTS.hue);
    setChroma(DEFAULTS.chroma);
    setRadius(DEFAULTS.radius);
    setFontSans(DEFAULTS.fontSans);
    toast.success('Tokens reset to Kwickly defaults');
  };

  const handleCopy = () => {
    const vars = Object.entries(previewTheme.light)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
    const output = `:root {\n${vars}\n  --font-sans: ${fontSans};\n}`;
    navigator.clipboard.writeText(output);
    toast.success('CSS variables copied!', {
      description: 'Paste into src/index.css under :root { }',
    });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'colors', label: 'Colors', icon: <Icons.Palette className="w-4 h-4" /> },
    { id: 'shape', label: 'Shape', icon: <Icons.Square className="w-4 h-4" /> },
    { id: 'type', label: 'Type', icon: <Icons.Type className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-80 shrink-0 border-l border-border bg-card overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icons.Sliders className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Token Editor</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Edit tokens live — changes preview instantly
        </p>
      </div>

      {/* Tab Nav — exact from TenantBranding.tsx */}
      <div className="flex gap-2 p-4 border-b border-border">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${
              activeTab === id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">

        {activeTab === 'colors' && (
          <div className="space-y-6 animate-in fade-in duration-200">

            {/* Hue — from TenantBranding.tsx */}
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
                onValueChange={v => setHue(Array.isArray(v) ? v[0] : v)}
                className="cursor-grab active:cursor-grabbing"
              />
              {/* eslint-disable-next-line no-restricted-syntax */}
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 opacity-60" />

              {/* Live swatch + contrast indicator */}
              <div className="flex items-center gap-4 mt-2">
                <div
                  className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: swatchStyle, color: swatchFg }}
                >
                  Aa
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border flex-1 ${
                  contrastIsValid
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-warning/10 text-warning border-warning/20'
                }`}>
                  {contrastIsValid
                    ? <Icons.CheckCircle2 className="h-3.5 w-3.5" />
                    : <Icons.AlertTriangle className="h-3.5 w-3.5" />}
                  {contrastIsValid
                    ? `${contrastRatio.toFixed(1)}:1 — WCAG AA`
                    : `${contrastRatio.toFixed(1)}:1 — Too low`}
                </div>
              </div>
            </div>

            {/* Chroma — from TenantBranding.tsx */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Intensity (Chroma)</Label>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">{chroma.toFixed(2)}</span>
              </div>
              <Slider
                value={[chroma]}
                min={0}
                max={0.3}
                step={0.01}
                onValueChange={v => setChroma(Array.isArray(v) ? v[0] : v)}
                className="cursor-grab active:cursor-grabbing"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Grayscale</span>
                <span>Vibrant</span>
              </div>
            </div>

            {/* Token preview swatches */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated Tokens</Label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <div
                    key={n}
                    title={`--chart-${n}`}
                    className="h-8 rounded-md border border-border/30"
                    style={{ background: `var(--chart-${n})` }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['--primary', '--secondary', '--muted'].map(t => (
                  <div key={t} className="space-y-0.5">
                    <div className="h-6 rounded-md border border-border/30" style={{ background: `var(${t})` }} />
                    <span className="text-[9px] text-muted-foreground font-mono truncate block">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shape' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Border Radius</Label>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">{radius}rem</span>
              </div>
              <Slider
                value={[radius]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={v => setRadius(Array.isArray(v) ? v[0] : v)}
                className="cursor-grab active:cursor-grabbing"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0rem (Sharp)</span>
                <span>2rem (Pill)</span>
              </div>
            </div>

            {/* Radius preview */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
              <div
                className="h-16 w-16 bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0"
                style={{ borderRadius: `${radius}rem` }}
              >
                Btn
              </div>
              <div
                className="flex-1 h-16 bg-card border border-border flex items-center justify-center text-xs text-muted-foreground"
                style={{ borderRadius: `${radius}rem` }}
              >
                Card
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Sets <span className="font-mono text-foreground">--radius</span> which cascades to{' '}
              <span className="font-mono">rounded-md</span>, <span className="font-mono">rounded-lg</span>, and{' '}
              <span className="font-mono">rounded-xl</span> card styles.
            </p>
          </div>
        )}

        {activeTab === 'type' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Primary Font (Sans-Serif)</Label>
              <Select value={fontSans} onValueChange={v => setFontSans(v || DEFAULTS.fontSans)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poppins, sans-serif">Poppins (Current)</SelectItem>
                  <SelectItem value="Inter, sans-serif">Inter (Modern)</SelectItem>
                  <SelectItem value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</SelectItem>
                  <SelectItem value="'DM Sans', sans-serif">DM Sans (Friendly)</SelectItem>
                  <SelectItem value="Roboto, sans-serif">Roboto (Clean)</SelectItem>
                  <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                  <SelectItem value="ui-sans-serif, system-ui, sans-serif">System UI (Native)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font preview */}
            <div className="bg-background border border-border rounded-lg p-4 space-y-2" style={{ fontFamily: fontSans }}>
              <p className="text-lg font-bold text-foreground">Restaurant Dashboard</p>
              <p className="text-sm font-medium text-foreground">Employee Directory · Table Management</p>
              <p className="text-sm text-muted-foreground">Real-time branch metrics and daily sales reports.</p>
              <p className="text-xs text-muted-foreground">TODAY'S REVENUE · ACTIVE STAFF</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2 shrink-0">
        <Button onClick={handleCopy} className="w-full h-9 text-sm font-semibold" size="sm">
          <Icons.Download className="h-4 w-4" />
          Copy CSS Variables
        </Button>
        <Button variant="outline" onClick={handleReset} className="w-full h-9 text-sm" size="sm">
          <Icons.RefreshCw className="h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
    </aside>
  );
}
