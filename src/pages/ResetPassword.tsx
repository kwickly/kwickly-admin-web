import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Invalid Link</h1>
          <p className="text-muted-foreground">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="inline-block text-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-xl overflow-hidden border border-border">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">New Password</h1>
            <p className="text-muted-foreground">Create a new password for your account.</p>
          </div>
          
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="bg-success/10 text-success p-4 rounded-lg text-sm">
                Your password has been successfully reset!
              </div>
              <Button 
                onClick={() => navigate("/login")}
                className="w-full"
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
                    className="w-full px-4 py-2 pr-10 border border-border rounded-md bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                    className="w-full px-4 py-2 pr-10 border border-border rounded-md bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={resetMutation.isPending}
                className="w-full"
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
