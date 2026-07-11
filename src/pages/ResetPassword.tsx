import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { usePublicBranding } from "@/hooks/api/useBranding";
import { getContrastColor, isValidHex } from "@/lib/colors";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
  }, [branding]);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
    }
  }, [token]);

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      toast.success(data.message || "Password successfully reset!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to reset password. The link may have expired.";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    resetMutation.mutate();
  };

  const showKwickly = !branding?.hideKwicklyBranding;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Invalid Link</h1>
          <p className="text-muted-foreground">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="inline-flex min-h-[44px] items-center justify-center text-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

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

            <h1 className="text-3xl font-bold text-foreground mb-2">New Password</h1>
            <p className="text-muted-foreground">Create a new password for your account.</p>
          </div>
          
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="bg-success/10 text-success p-4 rounded-lg text-sm">
                Your password has been successfully reset!
              </div>
              <Button 
                onClick={() => navigate("/login")}
                className="w-full min-h-[44px]"
              >
                Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2 pr-12 border border-border rounded-md bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none transition-shadow"
                    placeholder="••••••••"
                    required
                    minLength={8}
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
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2 pr-12 border border-border rounded-md bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none transition-shadow"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={resetMutation.isPending || isLoadingBranding}
                className="w-full min-h-[44px] font-semibold"
              >
                {resetMutation.isPending ? "Saving..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
