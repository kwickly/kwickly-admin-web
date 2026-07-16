import { useEffect, useState } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "./button";

export function PushNotificationToggle() {
  const { isSupported, subscribe, unsubscribe, token } = usePushNotifications();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isSupported) return null;

  const handleToggle = async () => {
    setLoading(true);
    if (token) {
      await unsubscribe();
    } else {
      await subscribe();
    }
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : token ? (
        <Bell className="h-4 w-4 text-green-500" />
      ) : (
        <BellOff className="h-4 w-4 text-slate-400" />
      )}
      {token ? "Disable Push Notifications" : "Enable Push Notifications"}
    </Button>
  );
}
