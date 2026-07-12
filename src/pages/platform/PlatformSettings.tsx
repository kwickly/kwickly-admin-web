import { useState } from "react";
import {
  Settings, Mail, Globe, ShieldAlert, Layers,
  Lock, ExternalLink, CheckCircle2, AlertTriangle, Save,
  Send, Wifi, Database, Cpu, BrainCircuit, Users, ShoppingBag,
  BarChart3, Megaphone, Package, MonitorCheck, Fingerprint,
  Eye, EyeOff, Server, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabId = "identity" | "smtp" | "features" | "plans" | "danger";

const NAV: { id: TabId; label: string; icon: React.ElementType; color: string; bg: string; isDanger?: boolean }[] = [
  { id: "identity", label: "Identity",      icon: Fingerprint, color: "text-primary",      bg: "bg-primary/10" },
  { id: "smtp",     label: "Email & SMTP",  icon: Mail,        color: "text-info",         bg: "bg-info/10" },
  { id: "features", label: "Feature Flags", icon: Zap,         color: "text-warning",      bg: "bg-warning/10" },
  { id: "plans",    label: "Plan Limits",   icon: Layers,      color: "text-success",      bg: "bg-success/10" },
  { id: "danger",   label: "Danger Zone",   icon: ShieldAlert, color: "text-destructive",  bg: "bg-destructive/10", isDanger: true },
];

const FEATURES = [
  { key: "loyalty",     label: "Loyalty & Wallet",  desc: "Points, rewards & digital wallets",      icon: BrainCircuit,   color: "text-primary",            bg: "bg-primary/10",              enabled: true  },
  { key: "crm",         label: "CRM & Customers",   desc: "Profiles, segments & campaigns",          icon: Users,          color: "text-info",               bg: "bg-info/10",                 enabled: true  },
  { key: "ads",         label: "Promotions & Ads",  desc: "In-app advertisement engine",             icon: Megaphone,      color: "text-warning",            bg: "bg-warning/10",              enabled: true  },
  { key: "payroll",     label: "Payroll & HR",      desc: "Salary runs, timesheets & leaves",        icon: Server,         color: "text-primary",            bg: "bg-primary/10",              enabled: true  },
  { key: "inventory",   label: "Inventory",          desc: "Stock tracking & suppliers",              icon: Package,        color: "text-info",               bg: "bg-info/10",                 enabled: true  },
  { key: "kds",         label: "Kitchen Display",   desc: "Real-time KDS order routing",             icon: MonitorCheck,   color: "text-success",            bg: "bg-success/10",              enabled: true  },
  { key: "analytics",   label: "Analytics",          desc: "Revenue, orders & staff reports",         icon: BarChart3,      color: "text-info",               bg: "bg-info/10",                 enabled: true  },
  { key: "multibranch", label: "Multi-Branch",       desc: "Branch hierarchy & reporting",            icon: ShoppingBag,   color: "text-primary",            bg: "bg-primary/10",              enabled: true  },
  { key: "api",         label: "API Access",         desc: "Tenant API key generation",               icon: Cpu,            color: "text-muted-foreground",   bg: "bg-muted",                   enabled: false },
  { key: "whitelabel",  label: "White-Label",        desc: "Custom themes & domains",                 icon: Globe,          color: "text-muted-foreground",   bg: "bg-muted",                   enabled: false },
];

type PlanKey = "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE";
const PLAN_TIERS: { key: PlanKey; border: string; badge: string; dot: string }[] = [
  { key: "FREE",       border: "border-t-muted",                                      badge: "bg-muted text-muted-foreground border-muted-foreground/20", dot: "bg-muted-foreground" },
  { key: "STARTER",    border: "border-t-info",                                       badge: "bg-info/10 text-info border-info/20",                       dot: "bg-info" },
  { key: "GROWTH",     border: "border-t-warning",                                    badge: "bg-warning/10 text-warning border-warning/20",              dot: "bg-warning" },
  { key: "ENTERPRISE", border: "border-t-primary",                                    badge: "bg-primary/10 text-primary border-primary/20",              dot: "bg-primary" },
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
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-170px)] animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Platform Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure global identity, email delivery, module access, and plan quotas.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 h-9 rounded-md font-medium shadow-sm transition-colors cursor-pointer"
        >
          {saving
            ? <div className="h-4 w-4 rounded-full border-[2.5px] border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} orientation="horizontal" className="flex flex-col flex-1 min-w-0 min-h-0 gap-6">

        {/* ── Top Nav ────────────────────────────────────────────────── */}
        <TabsList className="h-auto p-1.5 bg-card border border-border rounded-xl shadow-sm self-start justify-start flex-wrap">
          {NAV.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-none focus-visible:ring-0 after:hidden",
                item.isDanger
                  ? "data-active:bg-destructive/10 data-active:text-destructive data-active:shadow-none text-destructive/70 hover:text-destructive hover:bg-destructive/5"
                  : "data-active:bg-primary/10 data-active:text-primary data-active:shadow-none text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Content Area ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5 h-full overflow-y-auto no-scrollbar pb-12">

          {/* Section banner */}
          <div className={cn(
            "rounded-xl p-5 border relative overflow-hidden shadow-sm",
            activeNav.isDanger
              ? "bg-destructive/5 border-destructive/20"
              : "bg-card border-border"
          )}>
            <div className="relative flex items-center gap-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0", 
                activeNav.isDanger ? "bg-destructive/10" : "bg-primary/10"
              )}>
                <activeNav.icon className={cn("h-5 w-5", activeNav.isDanger ? "text-destructive" : "text-primary")} />
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
              <div className="rounded-xl bg-card border border-border shadow-sm overflow-hidden">
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
                      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn("h-9 bg-transparent focus-visible:ring-primary", mono && "font-mono text-sm")} />
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
                    <Input value={identity.supportUrl} onChange={(e) => setIdentity(s => ({ ...s, supportUrl: e.target.value }))} className="h-9 font-mono text-sm pr-9 bg-transparent focus-visible:ring-primary" />
                    <ExternalLink className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
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
                      <Input value={identity.termsUrl} onChange={(e) => setIdentity(s => ({ ...s, termsUrl: e.target.value }))} className="h-9 font-mono text-xs bg-transparent focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Privacy Policy</p>
                      <Input value={identity.privacyUrl} onChange={(e) => setIdentity(s => ({ ...s, privacyUrl: e.target.value }))} className="h-9 font-mono text-xs bg-transparent focus-visible:ring-primary" />
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
              <div className="rounded-xl bg-card border border-border shadow-sm overflow-hidden">

                <div className="grid grid-cols-5 gap-6 items-center px-6 py-5 border-b border-border/50">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">SMTP Host</Label>
                    <p className="text-xs text-muted-foreground">Hostname of your outbound mail relay</p>
                  </div>
                  <div className="col-span-3">
                    <Input value={smtp.host} onChange={(e) => setSmtp(s => ({ ...s, host: e.target.value }))} className="h-9 font-mono text-sm bg-transparent focus-visible:ring-primary" placeholder="smtp.resend.com" />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-6 items-center px-6 py-5 border-b border-border/50">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">Port & Security</Label>
                    <p className="text-xs text-muted-foreground">465 = SSL · 587 = STARTTLS</p>
                  </div>
                  <div className="col-span-3 flex items-center gap-4">
                    <Input value={smtp.port} onChange={(e) => setSmtp(s => ({ ...s, port: e.target.value }))} className="h-9 font-mono w-24 bg-transparent focus-visible:ring-primary" placeholder="465" />
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <Switch checked={smtp.secure} onCheckedChange={(v) => setSmtp(s => ({ ...s, secure: v }))} className="data-[state=checked]:bg-primary" />
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
                    <Input value={smtp.user} onChange={(e) => setSmtp(s => ({ ...s, user: e.target.value }))} className="h-9 font-mono text-sm bg-transparent focus-visible:ring-primary" placeholder="Username" />
                    <div className="relative">
                      <Input
                        type={showPass ? "text" : "password"}
                        value={smtp.password}
                        onChange={(e) => setSmtp(s => ({ ...s, password: e.target.value }))}
                        className="h-9 font-mono text-sm bg-transparent pr-9 focus-visible:ring-primary"
                        placeholder="API key / password"
                      />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
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
                    <Input value={smtp.fromName} onChange={(e) => setSmtp(s => ({ ...s, fromName: e.target.value }))} className="h-9 bg-transparent focus-visible:ring-primary" placeholder="Kwickly Platform" />
                    <Input type="email" value={smtp.fromEmail} onChange={(e) => setSmtp(s => ({ ...s, fromEmail: e.target.value }))} className="h-9 font-mono text-sm bg-transparent focus-visible:ring-primary" placeholder="noreply@kwickly.com" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <Button 
                  variant="outline" 
                  size="default" 
                  className="gap-2 h-8 text-xs font-semibold text-primary border-primary/20 hover:bg-primary/10 cursor-pointer" 
                  onClick={() => toast.info("Test email dispatched to your admin account.")}
                >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {features.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFeatures(prev => prev.map(x => x.key === f.key ? { ...x, enabled: !x.enabled } : x))}
                    className={cn(
                      "group relative flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 overflow-hidden cursor-pointer",
                      f.enabled
                        ? "bg-card border-border hover:border-primary/30 shadow-sm hover:shadow-md"
                        : "bg-muted/20 border-dashed border-border/40 opacity-60 hover:opacity-85"
                    )}
                  >
                    <div className={cn(
                      "relative h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all", 
                      f.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <f.icon className="h-4 w-4" />
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
                        className="pointer-events-none data-[state=checked]:bg-primary"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── PLAN LIMITS ──────────────────────────────────────────── */}
          {tab === "plans" && (
            <div className="animate-in fade-in-0 slide-in-from-right-1 duration-200 space-y-4">
              {PLAN_TIERS.map(({ key, border, badge, dot }) => {
                const isEnterprise = key === "ENTERPRISE";
                const data = PLAN_DEFAULTS[key];
                return (
                  <div key={key} className={cn("bg-card rounded-xl border border-border border-t-4 p-5 relative overflow-hidden transition-all hover:border-primary/40 shadow-sm", border)}>
                    <div className="relative">
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className={cn("h-2.5 w-2.5 rounded-full", dot)} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border", badge)}>{key}</span>
                        {isEnterprise && <span className="text-[11px] text-muted-foreground font-medium">— all limits are uncapped</span>}
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
                                className={cn("h-9 text-sm font-mono bg-transparent focus-visible:ring-primary", isEnterprise && "opacity-50 cursor-not-allowed")}
                              />
                              {isEnterprise && <Lock className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />}
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
            <div className="animate-in fade-in-0 slide-in-from-right-1 duration-200 space-y-5">
              {/* Warning strip */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 animate-pulse" />
                <p className="font-medium">
                  Changes here are instant and affect <strong>every tenant and user</strong> on the platform.
                </p>
              </div>

              {/* Danger switches */}
              <div className="rounded-xl bg-card border border-destructive/20 overflow-hidden shadow-sm">
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
                      className={cn("flex-shrink-0 data-[state=checked]:bg-destructive")}
                    />
                  </div>
                ))}
              </div>

              {/* System status */}
              <div className="rounded-xl bg-card border border-border shadow-sm p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Live System Status</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "API Server",  icon: Server,   ok: true },
                    { label: "Database",    icon: Database, ok: true },
                    { label: "Job Queue",   icon: Cpu,      ok: true },
                    { label: "Email Relay", icon: Wifi,     ok: true },
                  ].map(({ label, icon: Icon, ok }) => (
                    <div key={label} className="relative flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 overflow-hidden group hover:bg-card transition-colors">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 relative border", ok ? "bg-success/10 text-success border-success/10" : "bg-destructive/10 text-destructive border-destructive/10")}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="relative">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide leading-none mb-1">{label}</p>
                        <div className="flex items-center gap-1">
                          {ok ? (
                            <CheckCircle2 className="h-3 w-3 text-success" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                          <p className={cn("text-xs font-semibold", ok ? "text-success" : "text-destructive")}>
                            {ok ? "Healthy" : "Failing"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </Tabs>
    </div>
  );
}

function InfoTip({ icon: Icon, text, variant = "info" }: { icon: React.ElementType; text: string; variant?: "info" | "warning" }) {
  return (
    <div className={cn(
      "flex items-start gap-3 px-4 py-3.5 rounded-xl border text-xs leading-relaxed",
      variant === "warning" 
        ? "bg-warning/5 border-warning/20 text-warning" 
        : "bg-info/5 border-info/20 text-info"
    )}>
      <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      {text}
    </div>
  );
}
