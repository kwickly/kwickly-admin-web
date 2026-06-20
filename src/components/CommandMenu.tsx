import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  BarChart,
  Building,
  ScrollText,
  MenuSquare,
  ListTree,
  Users,
  Target,
  Send,
  Sun,
  Moon,
  LogOut
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useTheme } from "@/components/theme-provider"
import { useAuthStore } from "@/store/useAuth"
import { useHasPermission } from "@/lib/permissions"

export function CommandMenu({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { user, logout, impersonatedTenantId } = useAuthStore()
  
  const isPlatformAdmin = user?.role === 'platform_owner' || user?.role === 'super_admin'
  const showPlatformNav = isPlatformAdmin && !impersonatedTenantId;
  const canReadMenus = useHasPermission('menu:read')
  const canReadStaff = useHasPermission('staff:read')

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {!showPlatformNav && (
          <CommandGroup heading="Platform Navigation">
            <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
              <BarChart className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
          </CommandGroup>
        )}

        {showPlatformNav && (
          <CommandGroup heading="Settings & Admin">
            <CommandItem onSelect={() => runCommand(() => navigate("/platform/tenants"))}>
              <Building className="mr-2 h-4 w-4" />
              <span>Platform Tenants</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/platform/logs"))}>
              <ScrollText className="mr-2 h-4 w-4" />
              <span>System Audit Logs</span>
            </CommandItem>
          </CommandGroup>
        )}

        {!showPlatformNav && canReadMenus && (
          <CommandGroup heading="Menu Management">
            <CommandItem onSelect={() => runCommand(() => navigate("/menus/items"))}>
              <MenuSquare className="mr-2 h-4 w-4" />
              <span>Menu Items</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/menus/categories"))}>
              <ListTree className="mr-2 h-4 w-4" />
              <span>Menu Categories</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/menus/modifiers"))}>
              <ListTree className="mr-2 h-4 w-4" />
              <span>Menu Modifiers</span>
            </CommandItem>
          </CommandGroup>
        )}
        
        {!showPlatformNav && canReadStaff && (
          <CommandGroup heading="CRM & Staff">
            <CommandItem onSelect={() => runCommand(() => navigate("/crm/segments"))}>
              <Target className="mr-2 h-4 w-4" />
              <span>Customer Segments</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/crm/campaigns"))}>
              <Send className="mr-2 h-4 w-4" />
              <span>Campaigns</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/staff/directory"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Staff Directory</span>
            </CommandItem>
          </CommandGroup>
        )}

        <CommandSeparator />
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => logout())}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
