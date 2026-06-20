import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppShell from '@/layouts/AppShell'
import Login from '@/pages/Login'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Dashboard from '@/pages/Dashboard'
import TenantAnalytics from '@/pages/TenantAnalytics'

// Nested Workspace Layouts
import MenusLayout from '@/layouts/MenusLayout'
import StaffLayout from '@/layouts/StaffLayout'
import CrmLayout from '@/layouts/CrmLayout'
import SettingsLayout from '@/layouts/SettingsLayout'

// Pages
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
import BrandingSettings from '@/pages/settings/BrandingSettings'
import Combos from '@/pages/Combos'
import Orders from '@/pages/Orders'
import Ads from '@/pages/Ads'
import Subscriptions from '@/pages/Subscriptions'
import ProtectedRoute from '@/components/ProtectedRoute'
import Stock from '@/pages/inventory/Stock'
import Suppliers from '@/pages/inventory/Suppliers'
import Discounts from '@/pages/promotions/Discounts'

// Platform Owner administrative screens (Directory, System Metrics, and Logs)
import PlatformTenants from '@/pages/PlatformTenants'
import PlatformAuditLogs from '@/pages/PlatformAuditLogs'
import GlobalBilling from '@/pages/platform/GlobalBilling'
import PlatformSettings from '@/pages/platform/PlatformSettings'
import PlatformStaff from '@/pages/platform/PlatformStaff'
import PlatformTimesheets from '@/pages/platform/PlatformTimesheets'
import PlatformRoles from '@/pages/platform/PlatformRoles'
import TenantSettings from '@/pages/platform/TenantSettings'
import TenantUsage from '@/pages/platform/TenantUsage'
import SupportTickets from '@/pages/platform/SupportTickets'

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<TenantAnalytics />} />

              {/* Platform Management Routes */}
              <Route path="/platform/tenants" element={<PlatformTenants />} />
              <Route path="/platform/logs" element={<PlatformAuditLogs />} />
              <Route path="/platform/billing" element={<GlobalBilling />} />
              <Route path="/platform/settings" element={<PlatformSettings />} />
              <Route path="/platform/staff" element={<PlatformStaff />} />
              <Route path="/platform/staff/timesheets" element={<PlatformTimesheets />} />
              <Route path="/platform/staff/roles" element={<PlatformRoles />} />
              <Route path="/platform/tenant-settings" element={<TenantSettings />} />
              <Route path="/platform/usage" element={<TenantUsage />} />
              <Route path="/platform/support" element={<SupportTickets />} />

              {/* Menus Routes */}
              <Route element={<ProtectedRoute permission="menu:read" />}>
                <Route element={<MenusLayout />}>
                  <Route path="/menus" element={<Navigate to="/menus/items" replace />} />
                  <Route path="/menus/items" element={<MenuItems />} />
                  <Route path="/menus/categories" element={<MenuCategories />} />
                  <Route path="/menus/modifiers" element={<MenuModifiers />} />
                  <Route path="/menus/combos" element={<Combos />} />
                </Route>
              </Route>

              {/* Staff Routes */}
              <Route element={<ProtectedRoute permission="staff:read" />}>
                <Route element={<StaffLayout />}>
                  <Route path="/staff" element={<Navigate to="/staff/directory" replace />} />
                  <Route path="/staff/directory" element={<StaffDirectory />} />
                  <Route path="/staff/timesheets" element={<StaffTimesheets />} />
                  <Route path="/staff/roles" element={<StaffRoles />} />
                </Route>
              </Route>

              {/* CRM Routes */}
              <Route element={<ProtectedRoute permission="staff:read" />}>
                <Route element={<CrmLayout />}>
                  <Route path="/crm" element={<Navigate to="/crm/segments" replace />} />
                  <Route path="/crm/segments" element={<CustomerSegments />} />
                  <Route path="/crm/campaigns" element={<CampaignLogs />} />
                </Route>
              </Route>

              {/* Inventory Routes */}
              <Route element={<ProtectedRoute permission="inventory:read" />}>
                <Route path="/inventory" element={<Navigate to="/inventory/stock" replace />} />
                <Route path="/inventory/stock" element={<Stock />} />
                <Route path="/inventory/suppliers" element={<Suppliers />} />
              </Route>

              {/* Promotions Routes */}
              <Route element={<ProtectedRoute permission="promotions:manage" />}>
                <Route path="/promotions" element={<Navigate to="/promotions/discounts" replace />} />
                <Route path="/promotions/discounts" element={<Discounts />} />
              </Route>

              <Route element={<ProtectedRoute permission="orders:read" />}>
                <Route path="/orders" element={<Orders />} />
              </Route>
              
              <Route element={<ProtectedRoute permission="billing:manage" />}>
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/ads" element={<Ads />} />
                
                {/* Settings Routes */}
                <Route element={<SettingsLayout />}>
                  <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
                  <Route path="/settings/profile" element={<BranchProfile />} />
                  <Route path="/settings/loyalty" element={<LoyaltyConfig />} />
                  <Route path="/settings/branding" element={<BrandingSettings />} />
                </Route>
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
