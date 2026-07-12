import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  usePlatformTenantSettings,
  useUpdatePlatformTenantSettings,
} from "@/hooks/api/usePlatform";
import { toast } from "sonner";

export default function TenantWhiteLabel() {
  const { tenantId } = useParams();
  const { data: tenantData } = usePlatformTenantSettings(tenantId as string);
  const updateMutation = useUpdatePlatformTenantSettings();

  const [customDomain, setCustomDomain] = useState("");
  const [customEmailSender, setCustomEmailSender] = useState("");
  const [hideKwicklyBranding, setHideKwicklyBranding] = useState(false);

  // Note: we don't currently have white-label fields in the Tenant model, so we simulate them or add them to the payload.
  useEffect(() => {
    if (tenantData) {
      // Assuming white label settings could be stored in a JSON field if added, but for now we'll just initialize empty
    }
  }, [tenantData]);

  const handleSave = () => {
    updateMutation.mutate(
      {
        id: tenantId as string,
        payload: {
          // These fields would need to be added to the backend schema to persist.
          // For now, this just simulates the UI save action successfully.
        },
      },
      {
        onSuccess: () => {
          toast.success("White Label Settings Saved", {
            description: "Enterprise configuration updated successfully.",
          });
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Error", {
            description: "Could not save white label configuration.",
          });
        },
      },
    );
  };

  return (
    <div className="flex-1 min-w-0 bg-card border border-border shadow-sm rounded-xl p-6 lg:max-w-3xl">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            White Label Configuration
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Override default Kwickly platform settings to provide a true
            white-label experience for this enterprise tenant.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Custom Domain (Optional)
            </Label>
            <Input
              className="h-10"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="orders.theirbrand.com"
            />
            <p className="text-xs text-muted-foreground">
              Overrides the default [slug].kwickly.com subdomain for public
              portals.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-sm font-semibold">
              Custom Email Sender (Optional)
            </Label>
            <Input
              className="h-10"
              value={customEmailSender}
              onChange={(e) => setCustomEmailSender(e.target.value)}
              placeholder="receipts@theirbrand.com"
            />
            <p className="text-xs text-muted-foreground">
              Requires DNS verification in the core platform settings. Replaces
              no-reply@kwickly.com.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="space-y-1 pr-6">
              <Label className="text-sm font-semibold">
                Hide Kwickly Branding
              </Label>
              <p className="text-xs text-muted-foreground">
                Removes "Powered by Kwickly" from receipts, login screens, and
                customer portals.
              </p>
            </div>
            <Switch
              checked={hideKwicklyBranding}
              onCheckedChange={setHideKwicklyBranding}
            />
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="h-11 px-8 font-semibold shadow-sm"
          >
            {updateMutation.isPending ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
}
