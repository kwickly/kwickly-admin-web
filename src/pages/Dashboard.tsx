import { useAuthStore } from "@/store/useAuth";
// Import platform and tenant specific dashboards dynamically based on active role/session
import PlatformDashboard from "./PlatformDashboard";
import TenantDashboard from "./TenantDashboard";

export default function Dashboard() {
  const { user, impersonatedTenantId } = useAuthStore();

  const isPlatformAdmin = user?.role === 'platform_owner' || user?.role === 'super_admin';
  const showPlatformDashboard = isPlatformAdmin && !impersonatedTenantId;

  if (showPlatformDashboard) {
    return <PlatformDashboard />;
  }

  return <TenantDashboard />;
}
