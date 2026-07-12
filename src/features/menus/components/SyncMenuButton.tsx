import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useSyncMenu } from "@/hooks/api/useMenus";
import { useBranchStore } from "@/store/useBranch";
import { toast } from "sonner";

export default function SyncMenuButton() {
  const { selectedBranchId } = useBranchStore();
  const syncMutation = useSyncMenu();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    if (!selectedBranchId) {
      toast.error("Please select a branch first");
      return;
    }

    setIsSyncing(true);
    syncMutation.mutate(selectedBranchId, {
      onSuccess: () => {
        toast.success("Menu synced to devices successfully!");
        setTimeout(() => setIsSyncing(false), 1000);
      },
      onError: () => {
        toast.error("Failed to sync menu");
        setIsSyncing(false);
      }
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-2 shadow-sm"
    >
      <RefreshCcw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? "Syncing..." : "Sync Devices"}
    </Button>
  );
}
