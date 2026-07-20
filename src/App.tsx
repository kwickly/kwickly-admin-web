import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PWABadge } from '@/components/PWABadge'
import AppShell from '@/layouts/AppShell'
import Login from '@/pages/Login'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Dashboard from '@/pages/Dashboard'
import TenantAnalytics from '@/pages/TenantAnalytics'
import RevenueAnalytics from '@/pages/RevenueAnalytics'
import StaffAnalytics from '@/pages/StaffAnalytics'
import InventoryAnalytics from '@/pages/InventoryAnalytics'

// Nested Workspace Layouts
import MenusLayout from '@/layouts/MenusLayout'
import StaffLayout from '@/layouts/StaffLayout'
import CrmLayout from '@/layouts/CrmLayout'
import SettingsLayout from '@/layouts/SettingsLayout'

// Pages
import StaffDirectory from '@/pages/staff/StaffDirectory'
import StaffTimesheets from '@/pages/staff/StaffTimesheets'
import StaffLeaves from '@/pages/staff/StaffLeaves'
import PublicHolidays from '@/pages/staff/PublicHolidays'
import StaffPayroll from '@/pages/staff/StaffPayroll'
import PayrollRunDetails from '@/pages/staff/PayrollRunDetails'
import StaffRoles from '@/pages/staff/StaffRoles'
import MenuItems from '@/pages/menus/MenuItems'
import MenuCategories from '@/pages/menus/MenuCategories'
import MenuModifiers from '@/pages/menus/MenuModifiers'
import CustomerDirectory from '@/pages/crm/CustomerDirectory'
import CustomerDetails from '@/pages/crm/CustomerDetails'
import CustomerSegments from '@/pages/crm/CustomerSegments'
import CampaignLogs from '@/pages/crm/CampaignLogs'
import WalletTransactions from '@/pages/crm/WalletTransactions'
import BranchProfile from '@/pages/settings/BranchProfile'
import UserProfile from '@/pages/settings/UserProfile'
import LoyaltyConfig from '@/pages/settings/LoyaltyConfig'
import DeviceManagement from '@/pages/settings/DeviceManagement'
import OperationalSettings from '@/pages/settings/OperationalSettings'
import Combos from '@/pages/Combos'
import Orders from '@/pages/Orders'
import Ads from '@/pages/Ads'
import Subscriptions from '@/pages/Subscriptions'
import BrandingSettings from '@/pages/settings/BrandingSettings'
import ProtectedRoute from '@/components/ProtectedRoute'
import TenantLockScreen from '@/pages/TenantLockScreen'
import Stock from '@/pages/inventory/Stock'
import Suppliers from '@/pages/inventory/Suppliers'
import Discounts from '@/pages/promotions/Discounts'
import Pos from '@/pages/Pos'
import Kds from '@/pages/Kds'

// New Tenant Dashboard Pages
import LoyaltySubscriptions from '@/pages/tenant/LoyaltySubscriptions'
import AuditLogs from '@/pages/tenant/AuditLogs'
import FloorView from '@/pages/tables/FloorView'
import QRManager from '@/pages/tables/QRManager'

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
import PlatformSupportTickets from '@/pages/platform/SupportTickets'
import TenantSupportTickets from '@/pages/SupportTickets'
import { TenantThemeProvider } from '@/components/TenantThemeProvider'

import PlatformTenantSettingsLayout from '@/layouts/PlatformTenantSettingsLayout'
import TenantBranding from '@/pages/platform/TenantBranding'
import TenantWhiteLabel from '@/pages/platform/TenantWhiteLabel'

function App() {
  return (
    <TenantThemeProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/tenant-lock" element={<TenantLockScreen />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/support" element={<TenantSupportTickets />} />
              <Route path="/settings" element={<TenantSettings />} />
              <Route path="/analytics" element={<TenantAnalytics />} />
              <Route path="/analytics/revenue" element={<RevenueAnalytics />} />
              <Route path="/analytics/staff" element={<StaffAnalytics />} />
              <Route path="/analytics/inventory" element={<InventoryAnalytics />} />

              {/* Platform Management Routes */}
              <Route element={<ProtectedRoute requirePlatform />}>
                <Route path="/platform/tenants" element={<PlatformTenants />} />
                <Route path="/platform/logs" element={<PlatformAuditLogs />} />
                <Route path="/platform/billing" element={<GlobalBilling />} />
                <Route path="/platform/settings" element={<PlatformSettings />} />
                <Route path="/platform/staff" element={<PlatformStaff />} />
                <Route path="/platform/staff/timesheets" element={<PlatformTimesheets />} />
                <Route path="/platform/staff/roles" element={<PlatformRoles />} />
                <Route path="/platform/usage" element={<TenantUsage />} />
                <Route path="/platform/support" element={<PlatformSupportTickets />} />

                <Route path="/platform/tenants/:tenantId/settings" element={<PlatformTenantSettingsLayout />}>
                  <Route path="" element={<Navigate to="features" replace />} />
                  <Route path="features" element={<TenantSettings />} />
                  <Route path="branding" element={<TenantBranding />} />
                  <Route path="whitelabel" element={<TenantWhiteLabel />} />
                </Route>
              </Route>

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
                  <Route path="/staff/leaves" element={<StaffLeaves />} />
                  <Route path="/staff/holidays" element={<PublicHolidays />} />
                  <Route path="/staff/payroll" element={<StaffPayroll />} />
                  <Route path="/staff/payroll/:id" element={<PayrollRunDetails />} />
                  <Route path="/staff/roles" element={<StaffRoles />} />
                </Route>
              </Route>

              {/* CRM Routes */}
              <Route element={<ProtectedRoute permission="staff:read" />}>
                <Route element={<CrmLayout />}>
                  <Route path="/crm" element={<Navigate to="/crm/directory" replace />} />
                  <Route path="/crm/directory" element={<CustomerDirectory />} />
                  <Route path="/crm/customers/:id" element={<CustomerDetails />} />
                  <Route path="/crm/segments" element={<CustomerSegments />} />
                  <Route path="/crm/campaigns" element={<CampaignLogs />} />
                  <Route path="/crm/wallet" element={<WalletTransactions />} />
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
                <Route path="/pos" element={<Pos />} />
                <Route path="/kds" element={<Kds />} />
                <Route path="/tables" element={<FloorView />} />
                <Route path="/tables/qr" element={<QRManager />} />
              </Route>
              
              <Route element={<ProtectedRoute permission="billing:manage" />}>
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/ads" element={<Ads />} />
                
                {/* Settings Routes */}
                <Route element={<SettingsLayout />}>
                  <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
                  <Route path="/settings/profile" element={<BranchProfile />} />
                  <Route path="/settings/user-profile" element={<UserProfile />} />
                  <Route path="/settings/loyalty" element={<LoyaltyConfig />} />
                  <Route path="/settings/devices" element={<DeviceManagement />} />
                  <Route path="/settings/operations" element={<OperationalSettings />} />
                  <Route path="/settings/branding" element={<BrandingSettings />} />
                </Route>
              </Route>

              {/* New Tenant Scoped Pages */}
              <Route element={<ProtectedRoute permission="subscriptions:manage" />}>
                <Route path="/tenant/loyalty" element={<LoyaltySubscriptions />} />
              </Route>
              <Route element={<ProtectedRoute permission="settings:manage" />}>
                <Route path="/tenant/audit-logs" element={<AuditLogs />} />
              </Route>
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-right" />
        <PWABadge />
      </TooltipProvider>
    </BrowserRouter>
    </TenantThemeProvider>
  )
}

export default App
