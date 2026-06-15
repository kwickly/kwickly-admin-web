import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/layouts/AppShell'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Future routes will go here: /menus, /staff, /settings */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
