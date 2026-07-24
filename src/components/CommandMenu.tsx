import { Icons } from '@/components/shared/icons';
import * as React from "react"
import { useNavigate } from "react-router-dom"


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
              <Icons.LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
              <Icons.BarChart className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
          </CommandGroup>
        )}

        {showPlatformNav && (
          <CommandGroup heading="Settings & Admin">
            <CommandItem onSelect={() => runCommand(() => navigate("/platform/tenants"))}>
              <Icons.Building className="mr-2 h-4 w-4" />
              <span>Platform Tenants</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/platform/logs"))}>
              <Icons.ScrollText className="mr-2 h-4 w-4" />
              <span>System Audit Logs</span>
            </CommandItem>
          </CommandGroup>
        )}

        {!showPlatformNav && canReadMenus && (
          <CommandGroup heading="Menu Management">
            <CommandItem onSelect={() => runCommand(() => navigate("/menus/items"))}>
              <Icons.MenuSquare className="mr-2 h-4 w-4" />
              <span>Menu Items</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/menus/categories"))}>
              <Icons.ListTree className="mr-2 h-4 w-4" />
              <span>Menu Categories</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/menus/modifiers"))}>
              <Icons.ListTree className="mr-2 h-4 w-4" />
              <span>Menu Modifiers</span>
            </CommandItem>
          </CommandGroup>
        )}
        
        {!showPlatformNav && canReadStaff && (
          <CommandGroup heading="CRM & Staff">
            <CommandItem onSelect={() => runCommand(() => navigate("/crm/segments"))}>
              <Icons.Target className="mr-2 h-4 w-4" />
              <span>Customer Segments</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/crm/campaigns"))}>
              <Icons.Send className="mr-2 h-4 w-4" />
              <span>Campaigns</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/staff/directory"))}>
              <Icons.Users className="mr-2 h-4 w-4" />
              <span>Staff Directory</span>
            </CommandItem>
          </CommandGroup>
        )}

        <CommandSeparator />
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Icons.Sun className="mr-2 h-4 w-4" />
            <span>Light Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Icons.Moon className="mr-2 h-4 w-4" />
            <span>Dark Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => logout())}>
            <Icons.LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
