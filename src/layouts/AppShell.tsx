import { Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/useAuth"
import { useBranchStore } from "@/store/useBranch"
import { useBranches } from "@/hooks/api/useSettings"
import { useEffect, useState } from "react"
import { CommandMenu } from "@/components/CommandMenu"
import { PageBreadcrumbs } from "@/components/ui/breadcrumbs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { 
  Search,
  Bell,
  HelpCircle,
  User,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  SidebarInset, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { getContrastColor, isValidHex } from "@/lib/colors";

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    logout, 
    impersonatedTenantId, 
    impersonatedTenantName, 
    impersonatedTenantBrandColor, 
    impersonatedTenantLogoUrl, 
    setImpersonatedTenant 
  } = useAuthStore()
  const { selectedBranchId, setSelectedBranchId } = useBranchStore()
  const { data: branches, isLoading: isBranchesLoading } = useBranches()
  const { theme, setTheme } = useTheme()
  const [commandOpen, setCommandOpen] = useState(false)

  const isPlatformAdmin = user?.role === 'platform_owner' || user?.role === 'super_admin';

  // Generate dynamic breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { label: title, href: url };
  });

  const tab = new URLSearchParams(location.search).get("tab");
  if (tab) {
    breadcrumbs.push({
      label: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, ' '),
      href: location.pathname + location.search
    });
  }

  const activeBrandColor = impersonatedTenantId 
    ? impersonatedTenantBrandColor 
    : user?.tenantDetails?.brandColor;
    
  const activeLogoUrl = impersonatedTenantId 
    ? impersonatedTenantLogoUrl 
    : user?.tenantDetails?.logoUrl;

  // v2 Brand Token Injection: writes merchant brand color directly onto --primary
  // so all standard Tailwind utilities (bg-primary, text-primary, border-primary)
  // automatically reflect the active merchant's branding. No var(--brand-*) needed.
  useEffect(() => {
    const root = document.documentElement;
    if (activeBrandColor && isValidHex(activeBrandColor)) {
      const foreground = getContrastColor(activeBrandColor);
      root.style.setProperty('--primary',                       activeBrandColor);
      root.style.setProperty('--primary-foreground',            foreground);
      root.style.setProperty('--ring',                          activeBrandColor);
      root.style.setProperty('--sidebar-primary',               activeBrandColor);
      root.style.setProperty('--sidebar-primary-foreground',    foreground);
      root.style.setProperty('--accent-foreground',             activeBrandColor);
    } else {
      // Restore index.css defaults by removing inline overrides
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--ring');
      root.style.removeProperty('--sidebar-primary');
      root.style.removeProperty('--sidebar-primary-foreground');
      root.style.removeProperty('--accent-foreground');
    }
  }, [activeBrandColor]);

  // Auto-select the first branch if none is selected or if the selected branch is invalid (e.g. after switching tenants)
  useEffect(() => {
    if (branches && branches.length > 0) {
      const isValidBranch = branches.some(b => b.id === selectedBranchId);
      if (!selectedBranchId || !isValidBranch) {
        setSelectedBranchId(branches[0].id)
      }
    }
  }, [branches, selectedBranchId, setSelectedBranchId])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          {impersonatedTenantId && (
            <div className="bg-warning text-warning-foreground text-xs font-bold py-1.5 px-4 flex items-center justify-between border-b border-warning/70 shadow-sm animate-in slide-in-from-top duration-200">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning-foreground animate-pulse" />
                ⚠️ INSPECTION MODE: Currently viewing <strong>{impersonatedTenantName}</strong>
              </span>
              <button 
                onClick={() => {
                  setImpersonatedTenant(null, null);
                  setSelectedBranchId(null);
                  navigate('/platform/tenants');
                }} 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider transition-colors shadow-sm"
              >
                Exit Inspection
              </button>
            </div>
          )}
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-2 px-2 h-full">
              <SidebarTrigger className="-ml-1 text-muted-foreground" />
              <Separator orientation="vertical" className="mr-2 h-5" />
              
              {(!isPlatformAdmin || impersonatedTenantId) ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Branch:</span>
                    <div className="w-48">
                      <Select 
                        value={selectedBranchId || undefined} 
                        onValueChange={(val) => setSelectedBranchId(val)}
                        disabled={isBranchesLoading || !branches || branches.length === 0}
                      >
                        <SelectTrigger className="h-11 text-xs bg-muted border-none shadow-none focus:ring-1 focus:ring-ring">
                          <span className="line-clamp-1 flex-1 min-w-0 text-left">
                            {branches?.find(b => b.id === selectedBranchId)?.name || "Select a branch"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {branches?.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id} className="text-xs">
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-primary/20">
                    System Portal
                  </span>
                </div>
              )}
            </div>
            
            <div className="ml-auto flex items-center gap-2 px-2 h-full">
              <div className="hidden md:flex relative mr-2 group">
                <button 
                  onClick={() => setCommandOpen(true)}
                  className="flex items-center h-11 w-48 lg:w-72 rounded-xl border border-border bg-muted px-4 text-xs focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/50 transition-all text-muted-foreground group-hover:text-foreground/70"
                >
                  <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span>Search anything...</span>
                  <div className="ml-auto flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 shadow-sm">
                    <span className="text-[10px] font-medium text-muted-foreground">⌘</span>
                    <span className="text-[10px] font-medium text-muted-foreground">K</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-1 mr-2">
                <Button 
                  variant="ghost" 
                  className="h-11 w-11 p-0 text-muted-foreground hover:text-primary"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </Button>
                <Button variant="ghost" className="h-11 w-11 p-0 text-muted-foreground">
                  <Bell className="size-5" />
                </Button>
                <Button variant="ghost" className="h-11 w-11 p-0 text-muted-foreground">
                  <HelpCircle className="size-5" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-5 mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="h-11 px-3 gap-2 hover:bg-muted rounded-xl">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden bg-primary/10 text-primary">
                      {activeLogoUrl ? (
                        <img src={activeLogoUrl} alt="Logo" className="h-full w-full object-cover" />
                      ) : (
                        <User className="size-4" />
                      )}
                    </div>
                    <div className="hidden lg:flex flex-col items-start gap-0">
                      <span className="text-xs font-bold text-foreground leading-none">{user?.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium leading-none mt-0.5">
                        {user?.roleDetails?.name || user?.role.replace('_', ' ')}
                      </span>
                    </div>
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1">
                    My Account
                  </div>
                  <DropdownMenuItem render={<Link to="/settings/user-profile" className="cursor-pointer" />}>
                    <User className="mr-2 size-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive cursor-pointer focus:bg-destructive/10" onClick={() => logout()}>
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 min-w-0 p-6 md:p-8 lg:p-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full flex flex-col">
              <PageBreadcrumbs items={breadcrumbs} className="mb-6 opacity-70 hover:opacity-100 transition-opacity" />
              <Outlet />
            </div>
          </main>
        </SidebarInset>
        <CommandMenu open={commandOpen} setOpen={setCommandOpen} />
      </div>
    </SidebarProvider>
  )
}
