import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/useAuth';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export default function TenantWhiteLabel() {
  const { token, user } = useAuthStore();
  
  // Example starting state - in reality, we'd fetch the current values from the DB
  const [customDomain, setCustomDomain] = useState('');
  const [customEmailSender, setCustomEmailSender] = useState('');
  const [hideKwicklyBranding, setHideKwicklyBranding] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        customDomain: customDomain || null,
        customEmailSender: customEmailSender || null,
        hideKwicklyBranding
      };
      // Endpoint to update white label settings for this tenant. 
      // Replace with specific admin tenant route in Phase 2
      const res = await axios.patch(`${API_URL}/admin/tenants/${user?.tenantId}/whitelabel`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("White Label Settings Saved", { description: "Enterprise configuration updated successfully." });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Error", { description: "Could not save white label configuration." });
    }
  });

  return (
    <div className="flex-1 bg-card border border-border shadow-sm rounded-xl p-6 lg:max-w-3xl">
      <div className="space-y-8 animate-in fade-in duration-300">
        
        <div>
          <h3 className="text-xl font-bold text-foreground">White Label Configuration</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Override default Kwickly platform settings to provide a true white-label experience for this enterprise tenant.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Custom Domain (Optional)</Label>
            <Input 
              className="h-10"
              value={customDomain} 
              onChange={(e) => setCustomDomain(e.target.value)} 
              placeholder="orders.theirbrand.com" 
            />
            <p className="text-xs text-muted-foreground">Overrides the default [slug].kwickly.com subdomain for public portals.</p>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label className="text-sm font-semibold">Custom Email Sender (Optional)</Label>
            <Input 
              className="h-10"
              value={customEmailSender} 
              onChange={(e) => setCustomEmailSender(e.target.value)} 
              placeholder="receipts@theirbrand.com" 
            />
            <p className="text-xs text-muted-foreground">Requires DNS verification in the core platform settings. Replaces no-reply@kwickly.com.</p>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="space-y-1 pr-6">
              <Label className="text-sm font-semibold">Hide Kwickly Branding</Label>
              <p className="text-xs text-muted-foreground">Removes "Powered by Kwickly" from receipts, login screens, and customer portals.</p>
            </div>
            <Switch checked={hideKwicklyBranding} onCheckedChange={setHideKwicklyBranding} />
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <Button 
            onClick={() => saveMutation.mutate()} 
            disabled={saveMutation.isPending}
            className="h-11 px-8 font-semibold shadow-sm"
          >
            {saveMutation.isPending ? "Saving..." : "Save Configuration"}
          </Button>
        </div>

      </div>
    </div>
  );
}
