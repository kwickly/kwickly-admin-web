import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import AppShell from '@/layouts/AppShell'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Staff from '@/pages/Staff'
import Menus from '@/pages/Menus'
import Combos from '@/pages/Combos'
import Orders from '@/pages/Orders'
import Settings from '@/pages/Settings'
import ProtectedRoute from '@/components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/menus/combos" element={<Combos />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            {/* Example of RBAC strictly for SUPER_ADMIN:
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/tenants" element={<TenantsPage />} />
            </Route> */}
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}

export default App
