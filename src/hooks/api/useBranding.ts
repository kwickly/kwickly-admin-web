import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface PublicBranding {
  id: string;
  name: string;
  slug: string;
  brandColor: string | null;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  hideKwicklyBranding: boolean | null;
  themeMode: "light" | "dark" | "system" | null;
}

export function usePublicBranding() {
  return useQuery({
    queryKey: ["publicBranding", window.location.hostname],
    queryFn: async () => {
      // In development, you might want to hardcode a hostname for testing
      // const hostname = "brand.kwickly.com";
      const hostname = window.location.hostname;
      const res = await api.get<{ success: boolean; branding: PublicBranding | null }>(
        `/auth/branding?hostname=${encodeURIComponent(hostname)}`
      );
      return res.data.branding;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: false,
  });
}
