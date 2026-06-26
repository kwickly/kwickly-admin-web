import { useState } from "react";
import {
  Settings, Mail, Globe, ShieldAlert, Layers,
  Lock, ExternalLink, CheckCircle2, AlertTriangle, Save,
  Send, Wifi, Database, Cpu, BrainCircuit, Users, ShoppingBag,
  BarChart3, Megaphone, Package, MonitorCheck, Fingerprint,
  Eye, EyeOff, ChevronRight, Server, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TabId = "identity" | "smtp" | "features" | "plans" | "danger";

const NAV: { id: TabId; label: string; icon: React.ElementType; color: string; bg: string; isDanger?: boolean }[] = [
  { id: "identity", label: "Identity",      icon: Fingerprint, color: "text-primary",      bg: "bg-primary/10" },
  { id: "smtp",     label: "Email & SMTP",  icon: Mail,        color: "text-[var(--chart-2)]", bg: "bg-[var(--chart-2)]/10" },
  { id: "features", label: "Feature Flags", icon: Zap,         color: "text-warning",       bg: "bg-warning/10" },
  { id: "plans",    label: "Plan Limits",   icon: Layers,      color: "text-[var(--chart-4)]", bg: "bg-[var(--chart-4)]/10" },
  { id: "danger",   label: "Danger Zone",   icon: ShieldAlert, color: "text-destructive",   bg: "bg-destructive/10", isDanger: true },
];

const FEATURES = [
  { key: "loyalty",     label: "Loyalty & Wallet",  desc: "Points, rewards & digital wallets",      icon: BrainCircuit,   color: "text-primary",            bg: "bg-primary/10",              enabled: true  },
  { key: "crm",         label: "CRM & Customers",   desc: "Profiles, segments & campaigns",          icon: Users,          color: "text-[var(--chart-2)]",   bg: "bg-[var(--chart-2)]/10",     enabled: true  },
  { key: "ads",         label: "Promotions & Ads",  desc: "In-app advertisement engine",             icon: Megaphone,      color: "text-warning",            bg: "bg-warning/10",              enabled: true  },
  { key: "payroll",     label: "Payroll & HR",      desc: "Salary runs, timesheets & leaves",        icon: Server,         color: "text-[var(--chart-4)]",   bg: "bg-[var(--chart-4)]/10",     enabled: true  },
  { key: "inventory",   label: "Inventory",          desc: "Stock tracking & suppliers",              icon: Package,        color: "text-[var(--chart-5)]",   bg: "bg-[var(--chart-5)]/10",     enabled: true  },
  { key: "kds",         label: "Kitchen Display",   desc: "Real-time KDS order routing",             icon: MonitorCheck,   color: "text-success",            bg: "bg-success/10",              enabled: true  },
  { key: "analytics",   label: "Analytics",          desc: "Revenue, orders & staff reports",         icon: BarChart3,      color: "text-info",               bg: "bg-info/10",                 enabled: true  },
  { key: "multibranch", label: "Multi-Branch",       desc: "Branch hierarchy & reporting",            icon: ShoppingBag,   color: "text-primary",            bg: "bg-primary/10",              enabled: true  },
  { key: "api",         label: "API Access",         desc: "Tenant API key generation",               icon: Cpu,            color: "text-muted-foreground",   bg: "bg-muted",                   enabled: false },
  { key: "whitelabel",  label: "White-Label",        desc: "Custom themes & domains",                 icon: Globe,          color: "text-muted-foreground",   bg: "bg-muted",                   enabled: false },
];

type PlanKey = "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE";
const PLAN_TIERS: { key: PlanKey; gradient: string; badge: string; dot: string }[] = [
  { key: "FREE",       gradient: "from-muted/60 to-muted/20",                         badge: "bg-muted text-muted-foreground",         dot: "bg-muted-foreground" },
  { key: "STARTER",    gradient: "from-info/10 to-info/5",                            badge: "bg-info/15 text-info",                  dot: "bg-info"    },
  { key: "GROWTH",     gradient: "from-warning/10 to-warning/5",                      badge: "bg-warning/15 text-warning",            dot: "bg-warning" },
  { key: "ENTERPRISE", gradient: "from-primary/10 to-primary/5",                     badge: "bg-primary/15 text-primary",            dot: "bg-primary" },
];
const PLAN_DEFAULTS: Record<PlanKey, { branches: string; staff: string; items: string; storage: string }> = {
  FREE:       { branches: "1",   staff: "5",   items: "50",   storage: "500 MB" },
  STARTER:    { branches: "3",   staff: "20",  items: "200",  storage: "5 GB"   },
  GROWTH:     { branches: "10",  staff: "100", items: "1000", storage: "25 GB"  },
  ENTERPRISE: { branches: "∞",   staff: "∞",   items: "∞",    storage: "∞"      },
};

export default function PlatformSettings() {
  const [tab, setTab] = useState<TabId>("identity");
  const [identity, setIdentity] = useState({ platformName: "Kwickly", tagline: "Restaurant OS for the Modern Era", supportEmail: "support@kwickly.com", supportUrl: "https://help.kwickly.com", termsUrl: "https://kwickly.com/terms", privacyUrl: "https://kwickly.com/privacy" });
  const [smtp, setSmtp] = useState({ host: "smtp.resend.com", port: "465", secure: true, user: "resend", password: "", fromName: "Kwickly Platform", fromEmail: "noreply@kwickly.com" });
  const [showPass, setShowPass] = useState(false);
  const [features, setFeatures] = useState(FEATURES);
  const [danger, setDanger] = useState({ maintenance: false, noRegistrations: false, readOnly: false });
  const [saving, setSaving] = useState(false);

  const activeNav = NAV.find((n) => n.id === tab)!;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-110px)] animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between shrink-0 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <Settings className="h-3 w-3" />
            <span>Admin Portal</span>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">Platform Settings</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight">
            Platform Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure global identity, email delivery, module access, and plan quotas.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-6 gap-2 shadow-md font-semibold shrink-0 mt-2"
        >
          {saving
            ? <div className="h-4 w-4 rounded-full border-[2.5px] border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <div className="flex gap-7 items-start flex-1 min-h-0">

        {/* ── Left Nav ────────────────────────────────────────────────── */}
        <nav className="w-52 shrink-0 space-y-1 bg-card border border-border p-2 rounded-2xl shadow-sm">
          {NAV.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                  active
                    ? cn(item.isDanger ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground shadow-sm")
                    : item.isDanger
                      ? "text-destructive/50 hover:text-destructive hover:bg-destructive/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                  active ? item.bg : "bg-transparent group-hover:bg-muted"
                )}>
                  <item.icon className={cn("h-3.5 w-3.5", active ? item.color : "text-muted-foreground group-hover:text-foreground")} />
                </div>
                <span>{item.label}</span>
                {active && <ChevronRight className="h-3 w-3 ml-auto opacity-30" />}
              </button>
            );
          })}
        </nav>

        {/* ── Right Content ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5 h-full overflow-y-auto custom-scrollbar pr-4 pb-12">

          {/* Section banner */}
          <div className={cn(
            "rounded-2xl p-5 border relative overflow-hidden",
            activeNav.isDanger
              ? "bg-destructive/5 border-destructive/20"
              : "bg-card border-border shadow-sm"
          )}>
            <div className={cn(
              "absolute -top-8 -right-8 h-28 w-28 rounded-full blur-2xl opacity-40",
              activeNav.isDanger ? "bg-destructive/20" : activeNav.bg.replace("/10", "/30")
            )} />
            <div className="relative flex items-center gap-4">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0", activeNav.bg)}>
                <activeNav.icon className={cn("h-5 w-5", activeNav.color)} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">{activeNav.label}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tab === "identity" && "Public-facing details shown in emails, footers, and legal pages."}
                  {tab === "smtp"     && "Outbound mailer config. All system notifications route through this."}
                  {tab === "features" && "Toggle platform modules on or off for all tenants simultaneously."}
                  {tab === "plans"    && "Resource quotas enforced per subscription tier at object creation."}
                  {tab === "danger"   && "These controls take effect immediately across all tenants and users."}
                </p>
              </div>
            </div>
          </div>

          {/* ── IDENTITY ─────────────────────────────────────────────── */}
          {tab === "identity" && (
            <div className="animate-in fade-in-0 slide-in-from-right-1 duration-200 space-y-3">
              <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
                {[
                  { id: "platformName", label: "Platform Name", hint: "Shown in browser tabs and email subjects", value: identity.platformName, onChange: (v: string) => setIdentity(s => ({ ...s, platformName: v })) },
                  { id: "tagline",      label: "Tagline",       hint: "One-liner used in onboarding and landing pages", value: identity.tagline,      onChange: (v: string) => setIdentity(s => ({ ...s, tagline: v })) },
                  { id: "supportEmail", label: "Support Email", hint: "Displayed in password resets and system alerts", value: identity.supportEmail, onChange: (v: string) => setIdentity(s => ({ ...s, supportEmail: v })), mono: true },
                ].map(({ id, label, hint, value, onChange, mono }, i, arr) => (
                  <div key={id} className={cn("grid grid-cols-5 gap-6 items-center px-6 py-5", i < arr.length - 1 && "border-b border-border/50")}>
                    <div className="col-span-2 space-y-0.5">
                      <Label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</Label>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                    </div>
                    <div className="col-span-3">
                      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn("h-9 bg-background", mono && "font-mono text-sm")} />
                    </div>
                  </div>
                ))}

                {/* Help Center URL with link icon */}
                <div className="grid grid-cols-5 gap-6 items-center px-6 py-5 border-b border-border/50">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">Help Center URL</Label>
                    <p className="text-xs text-muted-foreground">Linked from the sidebar Help button</p>
                  </div>
                  <div className="col-span-3 relative">
                    <Input value={identity.supportUrl} onChange={(e) => setIdentity(s => ({ ...s, supportUrl: e.target.value }))} className="h-9 font-mono text-sm pr-9 bg-background" />
                    <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
                  </div>
                </div>

                {/* Legal URLs side by side */}
                <div className="grid grid-cols-5 gap-6 items-start px-6 py-5">
                  <div className="col-span-2 space-y-0.5 pt-1">
                    <Label className="text-sm font-semibold text-foreground">Legal URLs</Label>
                    <p className="text-xs text-muted-foreground">Linked in all email footers</p>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Terms of Service</p>
                      <Input value={identity.termsUrl} onChange={(e) => setIdentity(s => ({ ...s, termsUrl: e.target.value }))} className="h-9 font-mono text-xs bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Privacy Policy</p>
                      <Input value={identity.privacyUrl} onChange={(e) => setIdentity(s => ({ ...s, privacyUrl: e.target.value }))} className="h-9 font-mono text-xs bg-background" />
                    </div>
                  </div>
                </div>
              </div>

              <InfoTip icon={Server} text="These values are injected into all system-generated emails, legal footers, and white-label tenant portals." />
            </div>
          )}

          {/* ── SMTP ─────────────────────────────────────────────────── */}
          {tab === "smtp" && (
            <div className="animate-in fade-in-0 slide-in-from-right-1 duration-200 space-y-3">
              <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">

                <div className="grid grid-cols-5 gap-6 items-center px-6 py-5 border-b border-border/50">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">SMTP Host</Label>
                    <p className="text-xs text-muted-foreground">Hostname of your outbound mail relay</p>
                  </div>
                  <div className="col-span-3">
                    <Input value={smtp.host} onChange={(e) => setSmtp(s => ({ ...s, host: e.target.value }))} className="h-9 font-mono text-sm bg-background" placeholder="smtp.resend.com" />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-6 items-center px-6 py-5 border-b border-border/50">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">Port & Security</Label>
                    <p className="text-xs text-muted-foreground">465 = SSL · 587 = STARTTLS</p>
                  </div>
                  <div className="col-span-3 flex items-center gap-4">
                    <Input value={smtp.port} onChange={(e) => setSmtp(s => ({ ...s, port: e.target.value }))} className="h-9 font-mono w-24 bg-background" placeholder="465" />
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <Switch checked={smtp.secure} onCheckedChange={(v) => setSmtp(s => ({ ...s, secure: v }))} />
                      <span className="text-sm text-foreground font-medium">Use TLS / SSL</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-6 items-center px-6 py-5 border-b border-border/50">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">Authentication</Label>
                    <p className="text-xs text-muted-foreground">Username and API key from your email provider</p>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-3">
                    <Input value={smtp.user} onChange={(e) => setSmtp(s => ({ ...s, user: e.target.value }))} className="h-9 font-mono text-sm bg-background" placeholder="Username" />
                    <div className="relative">
                      <Input
                        type={showPass ? "text" : "password"}
                        value={smtp.password}
                        onChange={(e) => setSmtp(s => ({ ...s, password: e.target.value }))}
                        className="h-9 font-mono text-sm bg-background pr-9"
                        placeholder="API key / password"
                      />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-6 items-center px-6 py-5">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">Sender Identity</Label>
                    <p className="text-xs text-muted-foreground">Name and address recipients see in their inbox</p>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-3">
                    <Input value={smtp.fromName} onChange={(e) => setSmtp(s => ({ ...s, fromName: e.target.value }))} className="h-9 bg-background" placeholder="Kwickly Platform" />
                    <Input type="email" value={smtp.fromEmail} onChange={(e) => setSmtp(s => ({ ...s, fromEmail: e.target.value }))} className="h-9 font-mono text-sm bg-background" placeholder="noreply@kwickly.com" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <Button variant="outline" size="sm" className="gap-2 h-8 text-sm" onClick={() => toast.info("Test email dispatched to your admin account.")}>
                  <Send className="h-3.5 w-3.5" /> Send Test Email
                </Button>
                <p className="text-xs text-muted-foreground">Sends a verification email to the current platform owner account.</p>
              </div>
            </div>
          )}

          {/* ── FEATURES ─────────────────────────────────────────────── */}
          {tab === "features" && (
            <div className="animate-in fade-in-0 slide-in-from-right-1 duration-200 space-y-3">
              <p className="text-xs text-muted-foreground px-1">
                Toggling a module <strong>off</strong> immediately hides it from all tenant dashboards, regardless of their plan.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFeatures(prev => prev.map(x => x.key === f.key ? { ...x, enabled: !x.enabled } : x))}
                    className={cn(
                      "group relative flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 overflow-hidden",
                      f.enabled
                        ? "bg-card border-border hover:border-primary/30 shadow-sm hover:shadow"
                        : "bg-muted/20 border-dashed border-border/40 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    {/* Glow orb */}
                    {f.enabled && (
                      <div className={cn("absolute -top-4 -right-4 h-16 w-16 rounded-full blur-xl opacity-30 transition-opacity group-hover:opacity-50", f.bg)} />
                    )}
                    <div className={cn("relative h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all", f.enabled ? f.bg : "bg-muted")}>
                      <f.icon className={cn("h-4 w-4", f.enabled ? f.color : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 min-w-0 relative">
                      <p className={cn("text-sm font-semibold leading-none mb-1", f.enabled ? "text-foreground" : "text-muted-foreground")}>
                        {f.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{f.desc}</p>
                    </div>
                    <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={f.enabled}
                        onCheckedChange={() => setFeatures(prev => prev.map(x => x.key === f.key ? { ...x, enabled: !x.enabled } : x))}
                        className="pointer-events-none"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── PLAN LIMITS ──────────────────────────────────────────── */}
          {tab === "plans" && (
            <div className="animate-in fade-in-0 slide-in-from-right-1 duration-200 space-y-3">
              {PLAN_TIERS.map(({ key, gradient, badge, dot }) => {
                const isEnterprise = key === "ENTERPRISE";
                const data = PLAN_DEFAULTS[key];
                return (
                  <div key={key} className={cn("rounded-2xl border border-border bg-gradient-to-br p-5 relative overflow-hidden", gradient)}>
                    {/* Background glow */}
                    <div className={cn("absolute -bottom-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-20", dot)} />
                    <div className="relative">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className={cn("h-2 w-2 rounded-full", dot)} />
                        <span className={cn("text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full", badge)}>{key}</span>
                        {isEnterprise && <span className="text-[11px] text-muted-foreground">— all limits are uncapped</span>}
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {(["branches", "staff", "items", "storage"] as const).map((k) => (
                          <div key={k} className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {k === "branches" ? "Branches" : k === "staff" ? "Staff Users" : k === "items" ? "Menu Items" : "Storage"}
                            </p>
                            <div className="relative">
                              <Input
                                value={data[k]}
                                readOnly={isEnterprise}
                                className={cn("h-9 text-sm font-mono bg-background/80", isEnterprise && "opacity-50 cursor-not-allowed")}
                              />
                              {isEnterprise && <Lock className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/30 pointer-events-none" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              <InfoTip icon={Server} text="Limits are enforced server-side at object creation. Existing objects over the limit are not removed when a tenant is downgraded." />
            </div>
          )}

          {/* ── DANGER ZONE ──────────────────────────────────────────── */}
          {tab === "danger" && (
            <div className="animate-in fade-in-0 slide-in-from-right-1 duration-200 space-y-4">
              {/* Warning strip */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/20">
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm font-medium text-destructive">
                  Changes here are instant and affect <strong>every tenant and user</strong> on the platform.
                </p>
              </div>

              {/* Danger switches */}
              <div className="rounded-2xl bg-card border border-destructive/15 overflow-hidden shadow-sm">
                {([
                  { key: "maintenance"      as const, label: "Maintenance Mode",         desc: "All tenant dashboards show a maintenance screen. Only platform admins retain login access.",    badge: true  },
                  { key: "noRegistrations"  as const, label: "Disable Registrations",    desc: "Blocks the tenant sign-up flow entirely. All existing tenants are completely unaffected.",       badge: false },
                  { key: "readOnly"         as const, label: "Read-Only Mode",            desc: "Disables all write operations platform-wide. Use only before planned database migrations.",      badge: true  },
                ]).map(({ key, label, desc, badge }, i, arr) => (
                  <div key={key} className={cn(
                    "flex items-center gap-5 px-6 py-5 transition-colors",
                    danger[key] && "bg-destructive/5",
                    i < arr.length - 1 && "border-b border-border/50"
                  )}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <p className="text-sm font-bold text-foreground">{label}</p>
                        {danger[key] && badge && (
                          <span className="inline-flex items-center text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                    <Switch
                      checked={danger[key]}
                      onCheckedChange={(v) => {
                        if (v) toast.warning(`${label} activated`, { description: "All tenants are affected immediately." });
                        setDanger(s => ({ ...s, [key]: v }));
                      }}
                      className={cn("flex-shrink-0", danger[key] && "data-[state=checked]:bg-destructive")}
                    />
                  </div>
                ))}
              </div>

              {/* System status */}
              <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Live System Status</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "API Server",  icon: Server,   ok: true },
                    { label: "Database",    icon: Database, ok: true },
                    { label: "Job Queue",   icon: Cpu,      ok: true },
                    { label: "Email Relay", icon: Wifi,     ok: true },
                  ].map(({ label, icon: Icon, ok }) => (
                    <div key={label} className="relative flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 overflow-hidden group hover:bg-card transition-colors">
                      <div className={cn("absolute -top-3 -right-3 h-10 w-10 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity", ok ? "bg-success" : "bg-destructive")} />
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 relative", ok ? "bg-success/10" : "bg-destructive/10")}>
                        <Icon className={cn("h-4 w-4", ok ? "text-success" : "text-destructive")} />
                      </div>
                      <div className="relative">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide leading-none mb-1">{label}</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <p className="text-xs font-semibold text-success">Healthy</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function InfoTip({ icon: Icon, text, variant = "info" }: { icon: React.ElementType; text: string; variant?: "info" | "warning" }) {
  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3.5 rounded-xl border text-xs leading-relaxed",
      variant === "warning" ? "bg-warning/5 border-warning/20 text-warning" : "bg-info/5 border-info/20 text-info"
    )}>
      <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      {text}
    </div>
  );
}
