import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppShell from '@/layouts/AppShell'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import StaffDirectory from '@/pages/staff/StaffDirectory'
import StaffTimesheets from '@/pages/staff/StaffTimesheets'
import StaffRoles from '@/pages/staff/StaffRoles'
import MenuItems from '@/pages/menus/MenuItems'
import MenuCategories from '@/pages/menus/MenuCategories'
import MenuModifiers from '@/pages/menus/MenuModifiers'
import CustomerSegments from '@/pages/crm/CustomerSegments'
import CampaignLogs from '@/pages/crm/CampaignLogs'
import BranchProfile from '@/pages/settings/BranchProfile'
import LoyaltyConfig from '@/pages/settings/LoyaltyConfig'
import Combos from '@/pages/Combos'
import Orders from '@/pages/Orders'
import Ads from '@/pages/Ads'
import Subscriptions from '@/pages/Subscriptions'
import ProtectedRoute from '@/components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Menus Routes */}
              <Route path="/menus" element={<Navigate to="/menus/items" replace />} />
              <Route element={<ProtectedRoute permission="menu:read" />}>
                <Route path="/menus/items" element={<MenuItems />} />
                <Route path="/menus/categories" element={<MenuCategories />} />
                <Route path="/menus/modifiers" element={<MenuModifiers />} />
                <Route path="/menus/combos" element={<Combos />} />
              </Route>

              {/* Staff Routes */}
              <Route path="/staff" element={<Navigate to="/staff/directory" replace />} />
              <Route element={<ProtectedRoute permission="staff:read" />}>
                <Route path="/staff/directory" element={<StaffDirectory />} />
                <Route path="/staff/timesheets" element={<StaffTimesheets />} />
                <Route element={<ProtectedRoute permission="staff:write" />}>
                  <Route path="/staff/roles" element={<StaffRoles />} />
                </Route>
              </Route>

              {/* CRM Routes */}
              <Route path="/crm" element={<Navigate to="/crm/segments" replace />} />
              <Route element={<ProtectedRoute permission="staff:read" />}>
                <Route path="/crm/segments" element={<CustomerSegments />} />
                <Route path="/crm/campaigns" element={<CampaignLogs />} />
              </Route>

              <Route element={<ProtectedRoute permission="orders:read" />}>
                <Route path="/orders" element={<Orders />} />
              </Route>
              
              <Route element={<ProtectedRoute permission="billing:manage" />}>
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/ads" element={<Ads />} />
                
                {/* Settings Routes */}
                <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
                <Route path="/settings/profile" element={<BranchProfile />} />
                <Route path="/settings/loyalty" element={<LoyaltyConfig />} />
              </Route>
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
