import { 
  LayoutDashboard, 
  ChefHat,
  MenuSquare, 
  Users, 
  Settings, 
  CreditCard, 
  Target, 
  Megaphone, 
  ChevronRight 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useHasPermission } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";

interface NavItem {
  title: string;
  url: string;
  icon?: any;
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
          { title: "Timesheets", url: "/staff/timesheets", permission: "staff:read" },
          { title: "Role Builder", url: "/staff/roles", permission: "staff:write" },
        ],
      },
      {
        title: "CRM & Campaigns",
        url: "/crm",
        icon: Target,
        permission: "staff:read",
        items: [
          { title: "Customer Segments", url: "/crm/segments", permission: "staff:read" },
          { title: "Campaign Logs", url: "/crm/campaigns", permission: "staff:read" },
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
        ],
      },
    ]
  }
]

export function AppSidebar() {
  const location = useLocation();
  const hasPermission = useHasPermission;

  const filteredNavGroups = navGroups.map(group => ({
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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/50">
      <SidebarHeader className="h-16 flex items-center justify-center group-data-[collapsible=icon]:px-0 px-4">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:px-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20 text-white">
            <span className="text-lg font-bold tracking-tighter">K</span>
          </div>
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold leading-none tracking-tight text-slate-900 dark:text-white">Kwickly</span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {filteredNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-2 group-data-[collapsible=icon]:hidden">
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
                    return (
                      <Collapsible key={item.title} defaultOpen={isActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger render={
                            <SidebarMenuButton 
                              tooltip={item.title} 
                              isActive={isActive}
                              className={cn(
                                "h-9 px-3 transition-all duration-200 rounded-lg group-data-[collapsible=icon]:px-0 justify-start group-data-[collapsible=icon]:justify-center",
                                isActive 
                                  ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold" 
                                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                              )}
                            >
                              {item.icon && <item.icon className={cn("size-4 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500")} />}
                              <span className="text-[13px] ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                              <ChevronRight className="ml-auto size-3 shrink-0 transition-transform duration-200 [[data-open]_&]:rotate-90 [[data-state=open]_&]:rotate-90 text-slate-400 group-data-[collapsible=icon]:hidden" />
                            </SidebarMenuButton>
                          } />
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-5 border-l border-slate-200 dark:border-zinc-800/50 pl-3 mt-1.5 gap-0.5 group-data-[collapsible=icon]:hidden">
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton 
                                    isActive={location.pathname === subItem.url}
                                    className={cn(
                                      "h-8 px-3 rounded-md transition-colors duration-200",
                                      location.pathname === subItem.url
                                        ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-500/10"
                                        : "text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/50"
                                    )}
                                    render={
                                      <Link to={subItem.url}>
                                        <span className="text-[12px]">{subItem.title}</span>
                                      </Link>
                                    }
                                  />
                                </SidebarMenuSubItem>
                              ))}
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
                          "h-9 px-3 transition-all duration-200 rounded-lg group-data-[collapsible=icon]:px-0 justify-start group-data-[collapsible=icon]:justify-center",
                          isActive 
                            ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold" 
                            : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                        )}
                        render={
                          <Link to={item.url}>
                            {item.icon && <item.icon className={cn("size-4 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500")} />}
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
      <SidebarRail />
    </Sidebar>
  );
}
