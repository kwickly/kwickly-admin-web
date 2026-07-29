import { Icons } from '@/components/shared/icons';
import { useState } from 'react';
import { ColorPalette } from './design-system/sections/ColorPalette';
import { Typography } from './design-system/sections/Typography';
import { SpacingGrid } from './design-system/sections/SpacingGrid';
import { ButtonShowcase } from './design-system/sections/ButtonShowcase';
import { BadgeShowcase } from './design-system/sections/BadgeShowcase';
import { FormControls } from './design-system/sections/FormControls';
import { CardPatterns } from './design-system/sections/CardPatterns';
import { FeedbackOverlays } from './design-system/sections/FeedbackOverlays';
import { IconGrid } from './design-system/sections/IconGrid';
import { PagePatterns } from './design-system/sections/PagePatterns';
import { TokenGovernance } from './design-system/sections/TokenGovernance';
import { TokenEditorSidebar } from './design-system/TokenEditorSidebar';

const SECTIONS = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Type' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'forms', label: 'Forms' },
  { id: 'cards', label: 'Cards' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'icons', label: 'Icons' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'governance', label: 'Governance' },
];

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-16">
      <div className="mb-6">
        {/* Page header — exact pattern from StaffDirectory.tsx */}
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
        <div className="mt-4 h-px bg-border" />
      </div>
      {children}
    </section>
  );
}

export default function DesignSystem() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans design-system-root${isDark ? ' dark' : ''}`}>

      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center px-4 gap-4">

        {/* Logo + Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <Icons.Palette className="h-4 w-4 text-secondary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-foreground">Kwickly</span>
            <span className="text-xs text-muted-foreground ml-2.5">Design System</span>
          </div>
        </div>

        <div className="h-5 w-px bg-border mx-2 shrink-0 hidden sm:block" />

        {/* Section Jump Tabs */}
        <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="px-2.5 py-2.5 text-xs font-medium rounded-md whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-9 w-9 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isDark
              ? <Icons.Sun className="h-4 w-4" />
              : <Icons.Moon className="h-4 w-4" />}
          </button>
          {/* Token editor toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Hide token editor' : 'Show token editor'}
            className={`h-9 w-9 rounded-md border flex items-center justify-center transition-colors ${
              sidebarOpen
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icons.Sliders className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── Body: Main + Sidebar ─────────────────────────────────────── */}
      <div className="flex pt-14 h-screen">

        {/* Main Scroll Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10 space-y-20">

            <Section id="colors" title="Color Palette"
              description="Every CSS token in the system. Edit the token editor to see them all update live.">
              <ColorPalette />
            </Section>

            <Section id="typography" title="Typography"
              description="Font stacks, type scale, weights, and semantic text color tokens.">
              <Typography />
            </Section>

            <Section id="spacing" title="Spacing & Grid"
              description="8-point grid system, touch target sizes, border radius scale, and content width constraints.">
              <SpacingGrid />
            </Section>

            <Section id="buttons" title="Buttons"
              description="Shadcn Button variants, sizes, states, and the raw button pattern used in FloorView.">
              <ButtonShowcase />
            </Section>

            <Section id="badges" title="Badges"
              description="Shadcn Badge variants plus status badge patterns for tables, orders, and KDS urgency.">
              <BadgeShowcase />
            </Section>

            <Section id="forms" title="Form Controls"
              description="Input, Textarea, Select, Switch, Slider — all in the exact pattern used across settings pages.">
              <FormControls />
            </Section>

            <Section id="cards" title="Cards & Layouts"
              description="KPI cards, chart cards, floor grid cards, and empty states sourced from real pages.">
              <CardPatterns />
            </Section>

            <Section id="feedback" title="Feedback & Overlays"
              description="Skeleton loaders, toasts, modals, and sheet panels — all interactive.">
              <FeedbackOverlays />
            </Section>

            <Section id="icons" title="Icons"
              description="All icons from the centralized Icons dictionary. Click to copy the usage token.">
              <IconGrid />
            </Section>

            <Section id="patterns" title="Page Scanning Patterns"
              description="F, Z, and T scanning patterns as they appear in real project pages.">
              <PagePatterns />
            </Section>

            <Section id="governance" title="Token Governance"
              description="Rules and ESLint enforcement for the token-first CSS architecture.">
              <TokenGovernance />
            </Section>

            {/* Bottom spacer */}
            <div className="h-16" />
          </div>
        </main>

        {/* Token Editor Sidebar */}
        {sidebarOpen && <TokenEditorSidebar />}
      </div>
    </div>
  );
}
