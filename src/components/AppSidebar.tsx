import { 
  LayoutDashboard, 
  ChefHat,
  MenuSquare, 
  Users, 
  Settings, 
  CreditCard, 
  Target, 
  Megaphone, 
  ChevronRight,
  Building,
  ScrollText,
  Sparkles,
  Package,
  Tag,
  HeartHandshake,
  DollarSign,
  Activity,
  LifeBuoy,
  ShieldAlert,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";
import { useAuthStore } from "@/store/useAuth";
import { PushNotificationToggle } from "@/components/ui/PushNotificationToggle";
import type { Permission } from "@/lib/permissions";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  permission?: Permission;
  items?: { title: string; url: string; permission?: Permission }[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Live KDS",
        url: "/orders",
        icon: ChefHat,
        permission: "orders:read",
      },
      {
        title: "AI Analytics",
        url: "/analytics",
        icon: Sparkles,
        permission: "analytics:read",
        items: [
          { title: "Revenue Analytics", url: "/analytics/revenue", permission: "analytics:read" },
          { title: "Staff Analytics", url: "/analytics/staff", permission: "analytics:read" },
          { title: "Inventory Forecast", url: "/analytics/inventory", permission: "analytics:read" },
        ],
      },
    ]
  },
  {
    label: "Management",
    items: [
      {
        title: "Menus",
        url: "/menus",
        icon: MenuSquare,
        permission: "menu:read",
        items: [
          { title: "Menu Items", url: "/menus/items", permission: "menu:read" },
          { title: "Categories", url: "/menus/categories", permission: "menu:read" },
          { title: "Modifiers", url: "/menus/modifiers", permission: "menu:read" },
          { title: "Combos", url: "/menus/combos", permission: "menu:read" },
        ],
      },
      {
        title: "Staff",
        url: "/staff",
        icon: Users,
        permission: "staff:read",
        items: [
          { title: "Employee Directory", url: "/staff/directory", permission: "staff:read" },
          { title: "Timesheets", url: "/staff/timesheets", permission: "attendance:manage" },
          { title: "Staff Leaves", url: "/staff/leaves", permission: "attendance:manage" },
          { title: "Public Holidays", url: "/staff/holidays", permission: "attendance:manage" },
          { title: "Payroll & Salaries", url: "/staff/payroll", permission: "payroll:manage" },
          { title: "Role Builder", url: "/staff/roles", permission: "staff:write" },
        ],
      },
      {
        title: "CRM & Campaigns",
        url: "/crm",
        icon: Target,
        permission: "staff:read",
        items: [
          { title: "Customer Directory", url: "/crm/directory", permission: "staff:read" },
          { title: "Customer Segments", url: "/crm/segments", permission: "staff:read" },
          { title: "Campaign Logs", url: "/crm/campaigns", permission: "staff:read" },
          { title: "Wallet & Transactions", url: "/crm/wallet", permission: "wallet:manage" },
        ],
      },
      {
        title: "Inventory",
        url: "/inventory",
        icon: Package,
        permission: "inventory:read",
        items: [
          { title: "Stock Management", url: "/inventory/stock", permission: "inventory:read" },
          { title: "Suppliers", url: "/inventory/suppliers", permission: "inventory:read" },
        ],
      },
      {
        title: "Marketing & Promos",
        url: "/promotions",
        icon: Tag,
        permission: "promotions:manage",
        items: [
          { title: "Discounts & Offers", url: "/promotions/discounts", permission: "promotions:manage" },
        ],
      },
    ]
  },
  {
    label: "Administration",
    items: [
      {
        title: "Subscriptions",
        url: "/subscriptions",
        icon: CreditCard,
        permission: "billing:manage",
      },
      {
        title: "Ads",
        url: "/ads",
        icon: Megaphone,
        permission: "billing:manage",
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        permission: "billing:manage",
        items: [
          { title: "Branch Profile", url: "/settings/profile", permission: "billing:manage" },
          { title: "Loyalty & Wallet", url: "/settings/loyalty", permission: "billing:manage" },
          { title: "Hardware & Devices", url: "/settings/devices", permission: "settings:manage" },
          { title: "Branding & Colors", url: "/settings/branding", permission: "billing:manage" },
          { title: "Audit & Security Logs", url: "/tenant/audit-logs", permission: "settings:manage" },
        ],
      },
      {
        title: "Loyalty Plans",
        url: "/tenant/loyalty",
        icon: HeartHandshake,
        permission: "subscriptions:manage",
      },
    ]
  }
]

const platformNavGroups: NavGroup[] = [
  {
    label: "Platform Overview",
    items: [
      {
        title: "Platform Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "System Audit Logs",
        url: "/platform/logs",
        icon: ScrollText,
      },
    ]
  },
  {
    label: "Platform Management",
    items: [
      {
        title: "Tenants Directory",
        url: "/platform/tenants",
        icon: Building,
      },

      {
        title: "Usage & Quotas",
        url: "/platform/usage",
        icon: Activity,
      },
      {
        title: "Support Tickets",
        url: "/platform/support",
        icon: LifeBuoy,
      },
      {
        title: "Global Billing",
        url: "/platform/billing",
        icon: DollarSign,
      },
      {
        title: "Platform Staff",
        url: "/platform/staff",
        icon: ShieldAlert,
        items: [
          { title: "Admin Directory", url: "/platform/staff" },
          { title: "Timesheets", url: "/platform/staff/timesheets" },
          { title: "Role Builder", url: "/platform/staff/roles" },
        ]
      },
      {
        title: "Platform Settings",
        url: "/platform/settings",
        icon: Settings,
        items: [
          { title: "Identity", url: "/platform/settings?tab=identity" },
          { title: "Email & SMTP", url: "/platform/settings?tab=smtp" },
          { title: "Feature Flags", url: "/platform/settings?tab=features" },
          { title: "Plan Limits", url: "/platform/settings?tab=plans" },
          { title: "Danger Zone", url: "/platform/settings?tab=danger" },
        ]
      },
    ]
  }
]

export function AppSidebar() {
  const location = useLocation();
  const { user, impersonatedTenantId } = useAuthStore();

  const isPlatformAdmin = user?.role === 'platform_owner' || user?.role === 'super_admin';
  const showPlatformNav = isPlatformAdmin && !impersonatedTenantId;

  const activeNavGroups = showPlatformNav ? platformNavGroups : navGroups;

  const filteredNavGroups = activeNavGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.permission && !hasPermission(item.permission)) return false;
      return true;
    }).map(item => ({
      ...item,
      items: item.items?.filter(subItem => {
        if (subItem.permission && !hasPermission(subItem.permission)) return false;
        return true;
      })
    }))
  })).filter(group => group.items.length > 0);

  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/50">
      <SidebarHeader className="h-16 flex items-center justify-center group-data-[collapsible=icon]:px-0 px-4">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:px-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            <span className="text-lg font-bold tracking-tighter">K</span>
          </div>
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold leading-none tracking-tight text-foreground">Kwickly</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {filteredNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const hasSubItems = item.items && item.items.length > 0;
                  const isActive = hasSubItems 
                    ? location.pathname.startsWith(item.url)
                    : location.pathname === item.url;

                  if (hasSubItems) {
                    if (state === "collapsed") {
                      return (
                        <SidebarMenuItem key={item.title}>
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <SidebarMenuButton 
                                isActive={isActive}
                                className={cn(
                                  "min-h-[44px] px-3 py-2 transition-all duration-200 rounded-lg group-data-[collapsible=icon]:px-0 justify-start group-data-[collapsible=icon]:justify-center",
                                  isActive 
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                                    : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                                )}
                              >
                                {item.icon && <item.icon className={cn("size-4 shrink-0", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />}
                                <span className="text-[13px] ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                                <ChevronRight className="ml-auto size-3 shrink-0 transition-transform duration-200 [[data-open]_&]:rotate-90 [[data-state=open]_&]:rotate-90 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                              </SidebarMenuButton>
                            } />
                            <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-48">
                              <div className="px-2 py-1.5 text-xs text-muted-foreground font-semibold">{item.title}</div>
                              <DropdownMenuSeparator />
                              {item.items?.map((subItem) => (
                                <DropdownMenuItem key={subItem.title} render={
                                  <Link to={subItem.url} className="cursor-pointer w-full flex items-center text-sm">
                                    {subItem.title}
                                  </Link>
                                } />
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SidebarMenuItem>
                      );
                    }

                    return (
                      <Collapsible key={`${item.title}-${isActive}`} defaultOpen={isActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger render={
                            <SidebarMenuButton 
                              tooltip={item.title} 
                              isActive={isActive}
                              className={cn(
                                "min-h-[44px] px-3 py-2 transition-all duration-200 rounded-lg group-data-[collapsible=icon]:px-0 justify-start group-data-[collapsible=icon]:justify-center",
                                isActive 
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                              )}
                            >
                              {item.icon && <item.icon className={cn("size-4 shrink-0", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />}
                              <span className="text-[13px] ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                              <ChevronRight className="ml-auto size-3 shrink-0 transition-transform duration-200 [[data-open]_&]:rotate-90 [[data-state=open]_&]:rotate-90 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                            </SidebarMenuButton>
                          } />
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-5 border-l border-sidebar-border pl-3 mt-1.5 gap-0.5 group-data-[collapsible=icon]:hidden">
                              {item.items?.map((subItem) => {
                                const currentUrl = location.pathname + location.search;
                                const isSubActive = currentUrl === subItem.url || 
                                                    (location.pathname === subItem.url && !subItem.url.includes("?")) ||
                                                    (location.pathname === "/platform/settings" && !location.search && subItem.url === "/platform/settings?tab=identity");

                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton 
                                      isActive={isSubActive}
                                      className={cn(
                                        "min-h-[44px] px-3 py-2 rounded-md transition-colors duration-200",
                                        isSubActive
                                          ? "text-sidebar-primary font-medium bg-sidebar-accent"
                                          : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                                      )}
                                      render={
                                        <Link to={subItem.url}>
                                          <span className="text-[12px]">{subItem.title}</span>
                                        </Link>
                                      }
                                    />
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        isActive={isActive} 
                        tooltip={item.title}
                        className={cn(
                          "min-h-[44px] px-3 py-2 transition-all duration-200 rounded-lg group-data-[collapsible=icon]:px-0 justify-start group-data-[collapsible=icon]:justify-center",
                          isActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                            : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                        )}
                        render={
                          <Link to={item.url}>
                            {item.icon && <item.icon className={cn("size-4 shrink-0", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />}
                            <span className="text-[13px] ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                          </Link>
                        }
                      />
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <PushNotificationToggle />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
