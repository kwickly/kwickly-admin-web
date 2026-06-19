import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Plus, Eye, Edit, Trash, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/useAuth";
import { usePlatformTenants, useCreateTenant, useUpdateTenant, useDeleteTenant, type TenantStats } from "@/hooks/api/usePlatform";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PlatformTenants() {
  const navigate = useNavigate();
  const setImpersonatedTenant = useAuthStore((state) => state.setImpersonatedTenant);

  const { data: tenantsList, isLoading } = usePlatformTenants();
  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const deleteTenantMutation = useDeleteTenant();

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [plan, setPlan] = useState<"FREE" | "STARTER" | "GROWTH" | "ENTERPRISE">("FREE");

  const [brandColor, setBrandColor] = useState("#6366F1");

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantStats | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPlan, setEditPlan] = useState<"FREE" | "STARTER" | "GROWTH" | "ENTERPRISE">("FREE");
  const [editIsActive, setEditIsActive] = useState(true);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    createTenantMutation.mutate(
      { name, slug, email, phone, address, plan, brandColor },
      {
        onSuccess: () => {
          toast.success("Tenant registered successfully!");
          setCreateOpen(false);
          setName("");
          setSlug("");
          setEmail("");
          setPhone("");
          setAddress("");
          setPlan("FREE");
          setBrandColor("#6366F1");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || "Failed to register tenant.");
        },
      }
    );
  };

  const handleEditClick = (tenant: TenantStats) => {
    setEditingTenant(tenant);
    setEditName(tenant.name);
    setEditEmail(tenant.email || "");
    setEditPhone(tenant.phone || "");
    setEditAddress(tenant.address || "");
    setEditPlan(tenant.plan);
    setEditIsActive(tenant.isActive);
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    updateTenantMutation.mutate(
      {
        id: editingTenant.id,
        payload: {
          name: editName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          plan: editPlan,
          isActive: editIsActive,
        },
      },
      {
        onSuccess: () => {
          toast.success("Tenant configuration updated!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update tenant.");
        },
      }
    );
  };

  const handleDeleteClick = (id: string) => {
    setDeletingTenantId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingTenantId) return;

    deleteTenantMutation.mutate(deletingTenantId, {
      onSuccess: () => {
        toast.success("Tenant deleted successfully!");
        setDeleteOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete tenant.");
      },
    });
  };

  const handleImpersonate = (tenant: TenantStats) => {
    setImpersonatedTenant(tenant.id, tenant.name, tenant.brandColor, tenant.logoUrl);
    toast.success(`Entering Inspection Mode for ${tenant.name}`);
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Tenants Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage restaurant subscriptions, inspect dashboards, and configure system clients.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Tenant
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading tenants...</div>
      ) : !tenantsList || tenantsList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <Building className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No tenants registered yet</h3>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Get started by registering a new restaurant group.</p>
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Restaurant Name</TableHead>
                <TableHead>Subdomain Slug</TableHead>
                <TableHead>SaaS Plan</TableHead>
                <TableHead>Branches</TableHead>
                <TableHead>Users Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantsList.map((tenant) => (
                <TableRow key={tenant.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10">
                  <TableCell className="font-semibold text-slate-900 dark:text-zinc-100">
                    {tenant.name}
                    <div className="text-xs text-slate-500 font-normal mt-0.5">{tenant.email || "No contact email"}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                    {tenant.slug}.kwickly.com
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                      {tenant.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-900 dark:text-zinc-100">
                    {tenant.branchCount} location(s)
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-900 dark:text-zinc-100">
                    {tenant.userCount} users
                  </TableCell>
                  <TableCell>
                    <Badge variant={tenant.isActive ? "outline" : "destructive"} className="text-[10px] font-bold">
                      {tenant.isActive ? "ACTIVE" : "SUSPENDED"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleImpersonate(tenant)}
                        title="Inspect Dashboard"
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleEditClick(tenant)}
                        title="Edit Configuration"
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(tenant.id)}
                        title="Delete Tenant"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* CREATE DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <form onSubmit={handleCreate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-zinc-100">Add New Tenant</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-zinc-400">
                Register a new restaurant group onto the Kwickly platform.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">Restaurant Group Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swamy Foods"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="slug" className="text-slate-700 dark:text-zinc-300">Subdomain Prefix (Slug)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="e.g. swamy"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="email" className="text-slate-700 dark:text-zinc-300">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@restaurant.com"
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone" className="text-slate-700 dark:text-zinc-300">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="plan" className="text-slate-700 dark:text-zinc-300">SaaS Plan Tier</Label>
                <Select value={plan} onValueChange={(val: any) => setPlan(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue placeholder="Select Plan..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="STARTER">STARTER</SelectItem>
                    <SelectItem value="GROWTH">GROWTH</SelectItem>
                    <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="brandColor" className="text-slate-700 dark:text-zinc-300">Brand Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="h-10 w-10 rounded border border-slate-300 dark:border-zinc-700 shadow-sm cursor-pointer"
                    style={{ backgroundColor: brandColor }}
                    onClick={() => document.getElementById("plat-color-picker")?.click()}
                  />
                  <Input
                    id="brandColor"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    placeholder="#6366F1"
                    className="font-mono bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 flex-1"
                    maxLength={7}
                  />
                  <input
                    id="plat-color-picker"
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-850"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTenantMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {createTenantMutation.isPending ? "Registering..." : "Register"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-zinc-100">Edit Tenant Settings</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-zinc-400">
                Modify billing details or suspend restaurant logins.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="editName" className="text-slate-700 dark:text-zinc-300">Name</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="editEmail" className="text-slate-700 dark:text-zinc-300">Email</Label>
                  <Input
                    id="editEmail"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="editPhone" className="text-slate-700 dark:text-zinc-300">Phone</Label>
                  <Input
                    id="editPhone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editPlan" className="text-slate-700 dark:text-zinc-300">Plan</Label>
                <Select value={editPlan} onValueChange={(val: any) => setEditPlan(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="STARTER">STARTER</SelectItem>
                    <SelectItem value="GROWTH">GROWTH</SelectItem>
                    <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-zinc-750 text-indigo-650 focus:ring-indigo-500"
                />
                <Label htmlFor="editIsActive" className="text-sm text-slate-750 dark:text-zinc-300 cursor-pointer font-normal">
                  Active Status (suspends all staff on uncheck)
                </Label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-850"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTenantMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {updateTenantMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Are you sure you want to soft delete this tenant? This action is reversible by system admins but will instantly block all tenant access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-850"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteTenantMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteTenantMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
