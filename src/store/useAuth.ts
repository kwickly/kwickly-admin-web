import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  role: string;
  tenantId: string;
  roleDetails?: {
    id: string;
    name: string;
    slug: string;
    isSystem: boolean;
    permissions: string[];
  };
  tenantDetails?: {
    id: string;
    name: string;
    logoUrl: string | null;
    brandColor: string;
  } | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  impersonatedTenantId: string | null;
  impersonatedTenantName: string | null;
  impersonatedTenantBrandColor: string | null;
  impersonatedTenantLogoUrl: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setImpersonatedTenant: (
    id: string | null,
    name: string | null,
    brandColor?: string | null,
    logoUrl?: string | null
  ) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      impersonatedTenantId: null,
      impersonatedTenantName: null,
      impersonatedTenantBrandColor: null,
      impersonatedTenantLogoUrl: null,
      login: (user, token) => set({ 
        user, 
        token, 
        impersonatedTenantId: null, 
        impersonatedTenantName: null,
        impersonatedTenantBrandColor: null,
        impersonatedTenantLogoUrl: null
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        impersonatedTenantId: null, 
        impersonatedTenantName: null,
        impersonatedTenantBrandColor: null,
        impersonatedTenantLogoUrl: null
      }),
      setImpersonatedTenant: (id, name, brandColor = null, logoUrl = null) => set({ 
        impersonatedTenantId: id, 
        impersonatedTenantName: name,
        impersonatedTenantBrandColor: brandColor,
        impersonatedTenantLogoUrl: logoUrl
      }),
    }),
    {
      name: 'kwickly-auth-storage',
    }
  )
);
