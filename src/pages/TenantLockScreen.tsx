import { useAuthStore } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldAlert } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function TenantLockScreen() {
  const { user, logout } = useAuthStore();
  
  // If no user or they are somehow active/onboarding, send them to dashboard
  if (!user || user.tenantDetails?.status === 'ACTIVE' || user.tenantDetails?.status === 'ONBOARDING') {
    return <Navigate to="/dashboard" replace />;
  }

  const isSuspended = user.tenantDetails?.status === 'SUSPENDED';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isSuspended ? 'Account Suspended' : 'Account Terminated'}
        </h1>
        
        <p className="text-muted-foreground mb-8 text-sm">
          {isSuspended 
            ? 'Your organization\'s access to the Kwickly platform has been suspended. Please contact Kwickly Support to resolve this issue and restore access.'
            : 'Your organization\'s access to the Kwickly platform has been terminated. If you believe this is an error, please contact Kwickly Support.'}
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full font-semibold h-11"
            onClick={() => window.location.href = 'mailto:support@kwickly.com'}
          >
            Contact Support
          </Button>
          <Button 
            variant="outline" 
            className="w-full font-medium h-11"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
