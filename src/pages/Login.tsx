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
      // Cleanup if needed
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
    <div className="min-h-screen w-full flex bg-muted/20 transition-colors">
      
      {/* Left Column: Branding Pane */}
      <div className="hidden lg:flex flex-col flex-1 bg-primary text-primary-foreground p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="h-10 object-contain" />
            ) : showKwickly ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground text-primary shadow-lg font-bold text-xl tracking-tighter">
                K
              </div>
            ) : null}
            
            <h1 className="text-xl font-bold tracking-tight">
              {branding?.name || (showKwickly ? "Kwickly" : "")}
            </h1>
          </div>
          
          <div className="mt-auto mb-12 max-w-lg">
            <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              Powering the future of restaurant operations.
            </h2>
            <p className="text-lg opacity-80 font-medium">
              A comprehensive command center designed for speed, clarity, and reliability.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Pane with Centered Card */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[420px] bg-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border/50 p-8 sm:p-10 relative z-10">
          
          <div className="text-center mb-8">
            {/* Mobile Fallback Logo (Hidden on Desktop since it's in the left pane) */}
            <div className="lg:hidden">
              {branding?.logoUrl ? (
                <img src={branding.logoUrl} alt="Logo" className="h-12 mx-auto mb-4 object-contain" />
              ) : showKwickly ? (
                <div className="flex items-center justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
                    <span className="text-3xl font-bold tracking-tighter">K</span>
                  </div>
                </div>
              ) : null}
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1.5">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2 border border-border/60 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                placeholder="admin@restaurant.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline flex items-center">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2 pr-12 border border-border/60 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loginMutation.isPending || isLoadingBranding}
              className="w-full min-h-[44px] font-semibold text-base mt-4 shadow-md shadow-primary/10 rounded-lg"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

        </div>
      </div>

    </div>
  );
}
