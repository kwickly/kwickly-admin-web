import { useState } from "react";
import { MonitorSmartphone, Plus, Tablet, XCircle, Clock } from "lucide-react";
import { useDevices, useRegisterDevice, useRevokeDevice } from "@/hooks/api/useDevices";
import { useBranchStore } from "@/store/useBranch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/loaders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function DeviceManagement() {
  const { selectedBranchId } = useBranchStore();
  const { data: devices, isLoading } = useDevices();
  const registerDevice = useRegisterDevice();
  const revokeDevice = useRevokeDevice();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState<"POS" | "KDS">("POS");
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil((devices?.length || 0) / pageSize);
  const paginatedDevices = (devices || []).slice((page - 1) * pageSize, page * pageSize);

  const handleRegister = async () => {
    if (!selectedBranchId) {
      toast.error("Please select a branch first");
      return;
    }
    if (!newDeviceName) {
      toast.error("Device name is required");
      return;
    }

    try {
      const device = await registerDevice.mutateAsync({
        branchId: selectedBranchId,
        name: newDeviceName,
        type: newDeviceType,
      });
      setPairingCode(device.pairingCode);
      toast.success("Device registered successfully");
    } catch (error) {
      toast.error("Failed to register device");
    }
  };

  const handleRevoke = async (id: string) => {
    if (!selectedBranchId) return;
    try {
      await revokeDevice.mutateAsync({ id, branchId: selectedBranchId });
      toast.success("Device revoked");
    } catch (error) {
      toast.error("Failed to revoke device");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>;
      case "offline":
        return <Badge variant="secondary">Offline</Badge>;
      case "revoked":
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 border-rose-500/20">Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MonitorSmartphone className="h-6 w-6 text-primary" />
            Hardware & Devices
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage POS terminals and Kitchen Display Systems (KDS) for this branch.
          </p>
        </div>

        <Dialog open={isRegisterOpen} onOpenChange={(open) => {
          setIsRegisterOpen(open);
          if (!open) {
            setPairingCode(null);
            setNewDeviceName("");
            setNewDeviceType("POS");
          }
        }}>
          <DialogTrigger>
            <Button disabled={!selectedBranchId} className="h-11 px-6 rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Pair New Device
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pair New Hardware</DialogTitle>
              <DialogDescription>
                Register a new POS or KDS device. A pairing code will be generated.
              </DialogDescription>
            </DialogHeader>

            {pairingCode ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <p className="text-sm text-muted-foreground text-center">
                  Enter this code on your device to complete pairing. This code expires in 15 minutes.
                </p>
                <div className="bg-muted px-8 py-6 rounded-2xl border border-border">
                  <span className="text-5xl font-mono font-bold tracking-widest text-primary">
                    {pairingCode}
                  </span>
                </div>
                <Button onClick={() => setIsRegisterOpen(false)} className="w-full mt-4">
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Device Name</Label>
                  <Input 
                    placeholder="e.g. Front Register 1" 
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Device Type</Label>
                  <Select value={newDeviceType} onValueChange={(val) => setNewDeviceType(val as "POS" | "KDS")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POS">Point of Sale (POS)</SelectItem>
                      <SelectItem value="KDS">Kitchen Display System (KDS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleRegister} 
                  disabled={registerDevice.isPending || !newDeviceName}
                >
                  {registerDevice.isPending ? "Generating Code..." : "Generate Pairing Code"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {!selectedBranchId ? (
        <div className="p-12 text-center bg-card rounded-xl border border-border">
          <MonitorSmartphone className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No branch selected</h3>
          <p className="text-muted-foreground mt-2">Please select a branch from the top bar to view devices.</p>
        </div>
      ) : isLoading ? (
        <div className="mt-8">
          <TableSkeleton />
        </div>
      ) : !devices || devices.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-xl border border-border">
          <Tablet className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No devices found</h3>
          <p className="text-muted-foreground mt-2">You haven't paired any hardware for this branch yet.</p>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{device.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">ID: {device.id.split('-')[0]}...</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold text-[10px]">
                      {device.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(device.status)}
                    {device.status === 'offline' && device.pairingCode && (
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Awaiting pairing
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    {device.status !== 'revoked' && (
                      <Button 
                        variant="outline" 
                        size="default" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                        onClick={() => handleRevoke(device.id)}
                        disabled={revokeDevice.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {(devices?.length || 0) > pageSize && (
            <div className="p-4 border-t border-border/50">
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
