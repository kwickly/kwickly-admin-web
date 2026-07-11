import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantThemeConfig {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: { sans: string; serif: string; mono: string; };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
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
    logoDarkUrl: string | null;
    faviconUrl: string | null;
    brandColor: string;
    themeMode: string;
    themeConfig: TenantThemeConfig;
    status?: 'ACTIVE' | 'ONBOARDING' | 'SUSPENDED' | 'TERMINATED';
  } | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  impersonatedTenantId: string | null;
  impersonatedTenantName: string | null;
  impersonatedTenantBrandColor: string | null;
  impersonatedTenantLogoUrl: string | null;
  impersonatedTenantLogoDarkUrl: string | null;
  impersonatedTenantFaviconUrl: string | null;
  impersonatedTenantThemeMode: string | null;
  impersonatedTenantThemeConfig: TenantThemeConfig | null;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setImpersonatedTenant: (
    id: string | null,
    name: string | null,
    brandColor?: string | null,
    logoUrl?: string | null,
    logoDarkUrl?: string | null,
    faviconUrl?: string | null,
    themeMode?: string | null,
    themeConfig?: TenantThemeConfig | null
  ) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      impersonatedTenantId: null,
      impersonatedTenantName: null,
      impersonatedTenantBrandColor: null,
      impersonatedTenantLogoUrl: null,
      impersonatedTenantLogoDarkUrl: null,
      impersonatedTenantFaviconUrl: null,
      impersonatedTenantThemeMode: null,
      impersonatedTenantThemeConfig: null,
      login: (user, token, refreshToken) => set({ 
        user, 
        token, 
        refreshToken,
        impersonatedTenantId: null, 
        impersonatedTenantName: null,
        impersonatedTenantBrandColor: null,
        impersonatedTenantLogoUrl: null,
        impersonatedTenantLogoDarkUrl: null,
        impersonatedTenantFaviconUrl: null,
        impersonatedTenantThemeMode: null,
        impersonatedTenantThemeConfig: null
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        refreshToken: null,
        impersonatedTenantId: null, 
        impersonatedTenantName: null,
        impersonatedTenantBrandColor: null,
        impersonatedTenantLogoUrl: null,
        impersonatedTenantLogoDarkUrl: null,
        impersonatedTenantFaviconUrl: null,
        impersonatedTenantThemeMode: null,
        impersonatedTenantThemeConfig: null
      }),
      setImpersonatedTenant: (id, name, brandColor = null, logoUrl = null, logoDarkUrl = null, faviconUrl = null, themeMode = null, themeConfig = null) => set({ 
        impersonatedTenantId: id, 
        impersonatedTenantName: name,
        impersonatedTenantBrandColor: brandColor,
        impersonatedTenantLogoUrl: logoUrl,
        impersonatedTenantLogoDarkUrl: logoDarkUrl,
        impersonatedTenantFaviconUrl: faviconUrl,
        impersonatedTenantThemeMode: themeMode,
        impersonatedTenantThemeConfig: themeConfig
      }),
    }),
    {
      name: 'kwickly-auth-storage',
    }
  )
);
