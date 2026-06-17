import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuth';
import { hasPermission } from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';

interface ProtectedRouteProps {
  permission?: Permission;
}

export default function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    // If user does not have permission, redirect to their home dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Render child routes
  return <Outlet />;
}
