import { Outlet, Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuth"
import { useBranchStore } from "@/store/useBranch"
import { useBranches } from "@/hooks/api/useSettings"
import { useEffect } from "react"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { getContrastColor, adjustColorBrightness, getHexOpacity } from "@/lib/colors";

export default function AppShell() {
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

  const isPlatformAdmin = user?.role === 'platform_owner' || user?.role === 'super_admin';

  const activeBrandColor = impersonatedTenantId 
    ? impersonatedTenantBrandColor 
    : user?.tenantDetails?.brandColor;
    
  const activeLogoUrl = impersonatedTenantId 
    ? impersonatedTenantLogoUrl 
    : user?.tenantDetails?.logoUrl;

  // Inject dynamic brand custom variables into Document root for tailwind v4 styles mapping
  useEffect(() => {
    const root = document.documentElement;
    if (activeBrandColor) {
      const foreground = getContrastColor(activeBrandColor);
      const hover = adjustColorBrightness(activeBrandColor, -12);
      const tint = getHexOpacity(activeBrandColor, 10);
      const tintHover = getHexOpacity(activeBrandColor, 20);
      
      root.style.setProperty('--brand-primary', activeBrandColor);
      root.style.setProperty('--brand-primary-hover', hover);
      root.style.setProperty('--brand-foreground', foreground);
      root.style.setProperty('--brand-tint', tint);
      root.style.setProperty('--brand-tint-hover', tintHover);
    } else {
      root.style.removeProperty('--brand-primary');
      root.style.removeProperty('--brand-primary-hover');
      root.style.removeProperty('--brand-foreground');
      root.style.removeProperty('--brand-tint');
      root.style.removeProperty('--brand-tint-hover');
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
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-zinc-950">
        <AppSidebar />
        <SidebarInset>
          {impersonatedTenantId && (
            <div className="bg-amber-500 text-slate-950 text-xs font-bold py-1.5 px-4 flex items-center justify-between border-b border-amber-600 shadow-sm animate-in slide-in-from-top duration-200">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-950 animate-pulse" />
                ⚠️ INSPECTION MODE: Currently viewing <strong>{impersonatedTenantName}</strong>
              </span>
              <button 
                onClick={() => {
                  setImpersonatedTenant(null, null);
                  setSelectedBranchId(null);
                }} 
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider transition-colors shadow-sm"
              >
                Exit Inspection
              </button>
            </div>
          )}
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-2 px-2 h-full">
              <SidebarTrigger className="-ml-1 text-slate-500" />
              <Separator orientation="vertical" className="mr-2 h-5" />
              
              {(!isPlatformAdmin || impersonatedTenantId) ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Branch:</span>
                    <div className="w-48">
                      <Select 
                        value={selectedBranchId || undefined} 
                        onValueChange={(val) => setSelectedBranchId(val)}
                        disabled={isBranchesLoading || !branches || branches.length === 0}
                      >
                        <SelectTrigger className="h-7 text-xs bg-slate-50 dark:bg-zinc-800 border-none shadow-none focus:ring-1 focus:ring-indigo-500">
                          <span className="line-clamp-1 flex-1 text-left">
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
                  <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-indigo-200/50 dark:border-indigo-800/30">
                    System Portal
                  </span>
                </div>
              )}
            </div>
            
            <div className="ml-auto flex items-center gap-2 px-2 h-full">
              <div className="hidden md:flex relative mr-2 group">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="search" 
                  placeholder="Search anything..." 
                  className="h-9 w-48 lg:w-72 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 pl-9 pr-12 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                />
                <div className="absolute right-2 top-2 h-5 px-1.5 flex items-center gap-1 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm pointer-events-none">
                  <span className="text-[10px] font-medium text-slate-400">⌘</span>
                  <span className="text-[10px] font-medium text-slate-400">K</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mr-2">
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-slate-500">
                  <Bell className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-slate-500">
                  <HelpCircle className="size-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-5 mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" className="h-9 px-2 gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                      {activeLogoUrl ? (
                        <img src={activeLogoUrl} alt="Logo" className="h-full w-full object-cover" />
                      ) : (
                        <User className="size-4" />
                      )}
                    </div>
                    <div className="hidden lg:flex flex-col items-start gap-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user?.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-medium leading-none mt-0.5">
                        {user?.roleDetails?.name || user?.role.replace('_', ' ')}
                      </span>
                    </div>
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800 mb-1">
                    My Account
                  </div>
                  <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20" onClick={() => logout()}>
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
