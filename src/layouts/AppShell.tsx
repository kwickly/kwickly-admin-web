import { Outlet, Navigate, NavLink } from "react-router-dom"
import { useAuthStore } from "@/store/useAuth"
import { useBranchStore } from "@/store/useBranch"
import { useBranches } from "@/hooks/api/useSettings"
import { useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  LayoutDashboard, 
  ChefHat,
  MenuSquare, 
  Blocks,
  Users, 
  Settings,
  CreditCard,
  Target,
  LogOut,
  User
} from "lucide-react";
import api from "@/lib/api";

export default function AppShell() {
  const { user, logout } = useAuthStore()
  const { selectedBranchId, setSelectedBranchId } = useBranchStore()
  const { data: branches, isLoading: isBranchesLoading } = useBranches()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Failed to logout on server', e);
    } finally {
      logout();
    }
  }

  // Auto-select the first branch if none is selected
  useEffect(() => {
    if (branches && branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id)
    }
  }, [branches, selectedBranchId, setSelectedBranchId])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Live KDS", path: "/orders", icon: ChefHat },
    { name: "Menus", path: "/menus", icon: MenuSquare },
    { name: "Combos", path: "/menus/combos", icon: Blocks },
    { name: "Staff", path: "/staff", icon: Users },
    { name: "Subscriptions", path: "/subscriptions", icon: CreditCard },
    { name: "CRM & Campaigns", path: "/crm", icon: Target },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 font-bold text-xl text-indigo-400">
          Kwickly
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center px-8 justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100">Welcome back, {user.name}</h2>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-700 mx-4" />
            
            <div className="w-64">
              <Select 
                value={selectedBranchId || undefined} 
                onValueChange={(val) => setSelectedBranchId(val)}
                disabled={isBranchesLoading || !branches || branches.length === 0}
              >
                <SelectTrigger className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 capitalize hidden sm:block">
                  {user.role.replace('_', ' ')}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
