import { useAuthStore } from "@/store/useAuth";

export type Permission = 
  | "menu:read" | "menu:write" 
  | "orders:read" | "orders:write" 
  | "staff:read" | "staff:write" 
  | "analytics:read" 
  | "inventory:read" | "inventory:write"
  | "billing:manage"
  | "subscriptions:manage"
  | "attendance:manage"
  | "payroll:manage"
  | "crm:manage"
  | "promotions:manage"
  | "wallet:manage";

export const hasPermission = (requiredPermission: Permission | Permission[]): boolean => {
  const user = useAuthStore.getState().user;
  
  if (!user) return false;
  
  // Platform Owner has all permissions
  if (user.role === 'platform_owner') return true;

  const userPermissions = user.roleDetails?.permissions || [];
  
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.every(p => userPermissions.includes(p));
  }
  
  return userPermissions.includes(requiredPermission);
};

export const useHasPermission = (requiredPermission: Permission | Permission[]): boolean => {
  const user = useAuthStore(state => state.user);
  
  if (!user) return false;
  if (user.role === 'platform_owner') return true;

  const userPermissions = user.roleDetails?.permissions || [];
  
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.every(p => userPermissions.includes(p));
  }
  
  return userPermissions.includes(requiredPermission);
};
