import { useAuthStore } from "@/store/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login for scaffold
    login(
      { id: "1", name: "Admin User", role: "Tenant Admin", tenantId: "tenant_1" },
      "mock_jwt_token"
    );
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Kwickly</h1>
            <p className="text-slate-500 dark:text-zinc-400">Sign in to your restaurant portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-md bg-transparent text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="admin@restaurant.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-md bg-transparent text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
