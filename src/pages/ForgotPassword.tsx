import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-xl overflow-hidden border border-border">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="bg-success/10 text-success p-4 rounded-lg text-sm">
                If an account exists with {email}, you will receive a password reset link shortly. Please check your inbox (and spam folder).
              </div>
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
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
                  className="w-full px-4 py-2 border border-border rounded-md bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="admin@restaurant.com"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={resetMutation.isPending}
                className="w-full"
              >
                {resetMutation.isPending ? "Sending Link..." : "Send Reset Link"}
              </Button>
              
              <div className="text-center">
                <Link to="/login" className="text-sm font-medium text-primary hover:underline">
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
