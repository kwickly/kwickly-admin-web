import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Reset Password</h1>
            <p className="text-slate-500 dark:text-zinc-400">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm">
                If an account exists with {email}, you will receive a password reset link shortly. Please check your inbox (and spam folder).
              </div>
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-md bg-transparent text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="admin@restaurant.com"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={resetMutation.isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-md transition-colors"
              >
                {resetMutation.isPending ? "Sending Link..." : "Send Reset Link"}
              </button>
              
              <div className="text-center">
                <Link to="/login" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
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
