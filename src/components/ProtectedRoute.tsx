import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuth';

type AllowedRoles = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'MANAGER' | 'STAFF';

interface ProtectedRouteProps {
  allowedRoles?: AllowedRoles[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as AllowedRoles)) {
    // If user does not have permission, redirect to their home dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Render child routes
  return <Outlet />;
}
