import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicBranding } from "@/hooks/api/useBranding";
import { getContrastColor, isValidHex } from "@/lib/colors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
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

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      toast.success(data.message || "Reset link sent!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    resetMutation.mutate();
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
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="bg-success/10 text-success p-4 rounded-lg text-sm">
                If an account exists with {email}, you will receive a password reset link shortly. Please check your inbox (and spam folder).
              </div>
              <Link to="/login" className="inline-flex items-center justify-center min-h-[44px] text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <Button 
                type="submit" 
                disabled={resetMutation.isPending || isLoadingBranding}
                className="w-full min-h-[44px] font-semibold"
              >
                {resetMutation.isPending ? "Sending Link..." : "Send Reset Link"}
              </Button>
              
              <div className="text-center">
                <Link to="/login" className="inline-flex items-center justify-center min-h-[44px] text-sm font-medium text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
