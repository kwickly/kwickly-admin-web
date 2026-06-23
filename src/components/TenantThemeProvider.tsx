import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuth';

export const TenantThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, impersonatedTenantThemeConfig, impersonatedTenantThemeMode } = useAuthStore();
  
  const themeConfig = impersonatedTenantThemeConfig || user?.tenantDetails?.themeConfig;
  const themeMode = impersonatedTenantThemeMode || user?.tenantDetails?.themeMode || 'system';

  useEffect(() => {
    // 1. Handle Theme Mode (Dark/Light/System)
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (themeMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(themeMode);
    }

    // 2. Handle Custom Theme Configuration
    if (!themeConfig) return;

    // Remove any previously injected theme styles
    const existingStyle = document.getElementById('tenant-theme-injection');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'tenant-theme-injection';

    // Generate CSS variables from the JSONB themeConfig
    let cssString = `
      :root {
        /* Light Mode Colors */
        ${Object.entries(themeConfig.light || {}).map(([key, value]) => `${key}: ${value};`).join('\\n        ')}
        
        /* Fonts */
        ${themeConfig.fonts?.sans ? `--font-sans: ${themeConfig.fonts.sans};` : ''}
        ${themeConfig.fonts?.serif ? `--font-serif: ${themeConfig.fonts.serif};` : ''}
        ${themeConfig.fonts?.mono ? `--font-mono: ${themeConfig.fonts.mono};` : ''}
      }

      .dark {
        /* Dark Mode Colors */
        ${Object.entries(themeConfig.dark || {}).map(([key, value]) => `${key}: ${value};`).join('\\n        ')}
      }
    `;

    style.innerHTML = cssString;
    document.head.appendChild(style);

    return () => {
      // Clean up on unmount or tenant switch
      const el = document.getElementById('tenant-theme-injection');
      if (el) el.remove();
    };
  }, [themeConfig, themeMode]);

  return <>{children}</>;
};
