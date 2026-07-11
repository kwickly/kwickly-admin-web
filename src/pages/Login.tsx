import { useAuthStore } from "@/store/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { usePublicBranding } from "@/hooks/api/useBranding";
import { getContrastColor, isValidHex } from "@/lib/colors";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: branding, isLoading: isLoadingBranding } = usePublicBranding();

  // Inject White Label Branding
  useEffect(() => {
    const root = document.documentElement;
    if (branding?.brandColor && isValidHex(branding.brandColor)) {
      const foreground = getContrastColor(branding.brandColor);
      root.style.setProperty('--primary', branding.brandColor);
      root.style.setProperty('--primary-foreground', foreground);
      root.style.setProperty('--ring', branding.brandColor);
    } else {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--ring');
    }

    return () => {
      // Optional: Cleanup if navigating away before auth, 
      // but usually login sets it or AppShell handles it.
    };
  }, [branding]);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.response?.data?.message || "Invalid email or password.";
      toast.error(message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const showKwickly = !branding?.hideKwicklyBranding;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors">
      <div className="w-full max-w-md bg-card rounded-xl shadow-xl overflow-hidden border border-border">
        <div className="p-8">
          <div className="text-center mb-8">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="h-12 mx-auto mb-4 object-contain" />
            ) : showKwickly ? (
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
                  <span className="text-2xl font-bold tracking-tighter">K</span>
                </div>
              </div>
            ) : null}
            
            {showKwickly ? (
              <h1 className="text-3xl font-bold text-foreground mb-2">Kwickly</h1>
            ) : branding?.name ? (
              <h1 className="text-2xl font-bold text-foreground mb-2">{branding.name}</h1>
            ) : null}
            <p className="text-muted-foreground">Sign in to your restaurant portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2 border border-border rounded-md bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none transition-shadow"
                placeholder="admin@restaurant.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline min-h-[44px] flex items-center">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2 pr-12 border border-border rounded-md bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none transition-shadow"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loginMutation.isPending || isLoadingBranding}
              className="w-full min-h-[44px] font-semibold"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
