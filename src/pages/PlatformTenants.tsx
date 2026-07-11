import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Plus, Eye, Edit, Trash, ShieldAlert, MoreVertical, MapPin, Users, Phone, Mail, Globe } from "lucide-react";
import { useAuthStore } from "@/store/useAuth";
import { getContrastColor } from "@/lib/colors";
import { usePlatformTenants, useCreateTenant, useUpdateTenant, useDeleteTenant, type TenantStats } from "@/hooks/api/usePlatform";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { GridCardSkeleton } from "@/components/ui/loaders";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";

// Maps subscription plan tier to semantic badge classes from the global theme token set.
// Colors carry meaning: ENTERPRISE=brand primary, GROWTH=success, STARTER=info, FREE=muted.
function getPlanBadgeClass(plan: string): string {
  switch (plan) {
    case 'ENTERPRISE': return 'bg-primary/10 text-primary border-primary/20';
    case 'GROWTH':     return 'bg-success/10 text-success border-success/20';
    case 'STARTER':    return 'bg-info/10 text-info border-info/20';
    case 'FREE':       return 'bg-muted text-muted-foreground border-border';
    default:           return 'bg-muted text-muted-foreground border-border';
  }
}

export default function PlatformTenants() {
  const navigate = useNavigate();
  const setImpersonatedTenant = useAuthStore((state) => state.setImpersonatedTenant);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: response, isLoading: isTenantsLoading } = usePlatformTenants(page, 12, search);
  const { mutate: createTenant, isPending: isCreating } = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const deleteTenantMutation = useDeleteTenant();

  const tenantsList = response?.data || [];
  const meta = response?.meta;

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [plan, setPlan] = useState<"FREE" | "STARTER" | "GROWTH" | "ENTERPRISE">("FREE");
  const [brandColor, setBrandColor] = useState("#6366F1");

  // Details Modal State
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTenant, setViewTenant] = useState<TenantStats | null>(null);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantStats | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPlan, setEditPlan] = useState<"FREE" | "STARTER" | "GROWTH" | "ENTERPRISE">("FREE");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "SUSPENDED" | "TERMINATED">("ACTIVE");

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTenant, setDeletingTenant] = useState<TenantStats | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    createTenant(
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

  const handleCardClick = (tenant: TenantStats) => {
    setViewTenant(tenant);
    setViewOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, tenant: TenantStats) => {
    e.stopPropagation();
    setEditingTenant(tenant);
    setEditName(tenant.name);
    setEditEmail(tenant.email || "");
    setEditPhone(tenant.phone || "");
    setEditAddress(tenant.address || "");
    setEditPlan(tenant.plan);
    setEditStatus(tenant.status);
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
          status: editStatus,
        },
      },
      {
        onSuccess: () => {
          toast.success("Tenant configuration updated!");
          setEditOpen(false);
          // Also update the view modal if it's open
          if (viewOpen && viewTenant?.id === editingTenant.id) {
            setViewTenant({
              ...viewTenant,
              name: editName,
              email: editEmail,
              phone: editPhone,
              address: editAddress,
              plan: editPlan,
              status: editStatus,
            });
          }
        },
        onError: () => {
          toast.error("Failed to update tenant.");
        },
      }
    );
  };

  const handleDeleteClick = (e: React.MouseEvent, tenant: TenantStats) => {
    e.stopPropagation();
    setDeletingTenant(tenant);
    setDeleteConfirmationText("");
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingTenant || deleteConfirmationText !== deletingTenant.name) return;

    deleteTenantMutation.mutate(deletingTenant.id, {
      onSuccess: () => {
        toast.success("Tenant deleted successfully!");
        setDeleteOpen(false);
        if (viewOpen && viewTenant?.id === deletingTenant.id) {
          setViewOpen(false);
        }
      },
      onError: () => {
        toast.error("Failed to delete tenant.");
      },
    });
  };

  const handleImpersonate = (e: React.MouseEvent, tenant: TenantStats) => {
    e.stopPropagation();
    setImpersonatedTenant(tenant.id, tenant.name, tenant.brandColor, tenant.logoUrl);
    toast.success(`Entering Inspection Mode for ${tenant.name}`);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Tenants Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage restaurant subscriptions, inspect dashboards, and configure system clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search tenants..." 
            className="w-64"
          />
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Tenant
          </Button>
        </div>
      </div>

      {isTenantsLoading ? (
        <GridCardSkeleton count={8} />
      ) : !tenantsList || tenantsList.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-xl border border-border shadow-sm">
          <Building className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No tenants registered yet</h3>
          <p className="text-muted-foreground mt-2">Get started by registering a new restaurant group.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tenantsList.map((tenant) => (
            <Card 
              key={tenant.id} 
              className="bg-card border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer group flex flex-col h-full relative"
              onClick={() => handleCardClick(tenant)}
            >
              {/* Brand accent bar — uses tenant brand color, falls back to system --primary */}
              <div 
                className="w-full h-1.5 flex-shrink-0" 
                style={{ backgroundColor: tenant.brandColor || 'var(--primary)' }} 
              />
              
              <div className="p-5 flex flex-col h-full relative">
                {/* 3 Dots Menu */}
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      className="h-10 w-10 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-popover border-border shadow-lg rounded-xl">
                      <DropdownMenuItem 
                        onClick={(e) => handleImpersonate(e, tenant)}
                        className="cursor-pointer text-primary focus:bg-primary/10 focus:text-primary"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Inspect Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem 
                        onClick={(e) => handleEditClick(e, tenant)}
                        className="cursor-pointer text-foreground focus:bg-muted"
                      >
                        <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Edit Configuration</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteClick(e, tenant)}
                        className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete Tenant</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-start gap-4 mb-4 pr-8">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      backgroundColor: tenant.brandColor || 'var(--primary)',
                      color: tenant.brandColor ? getContrastColor(tenant.brandColor) : 'var(--primary-foreground)'
                    }}
                  >
                    {tenant.logoUrl ? (
                      <img src={tenant.logoUrl} alt={tenant.name} className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="text-xl font-bold uppercase">{tenant.name.substring(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground truncate w-full group-hover:text-primary transition-colors">
                      {tenant.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {tenant.slug}.kwickly.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  {/* Semantic color-coded plan badge */}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${getPlanBadgeClass(tenant.plan)}`}>
                    {tenant.plan}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className={`h-2 w-2 rounded-full ${tenant.status === "ACTIVE" ? "bg-success" : tenant.status === "SUSPENDED" ? "bg-warning" : "bg-destructive"}`}></span>
                    <span className={tenant.status === "ACTIVE" ? "text-success" : tenant.status === "SUSPENDED" ? "text-warning" : "text-destructive"}>{tenant.status}</span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{tenant.branchCount} <span className="text-xs font-normal text-muted-foreground">loc</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{tenant.userCount} <span className="text-xs font-normal text-muted-foreground">users</span></span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {meta && (
        <PaginationControls
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* DETAILED INFO MODAL */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border border-border p-0 overflow-hidden shadow-xl rounded-2xl">
          {viewTenant && (
            <>
              {/* Flat brand accent bar — no gradient, no blur */}
              <div 
                className="h-1.5 w-full"
                style={{ backgroundColor: viewTenant.brandColor || 'var(--primary)' }}
              />

              <div className="px-6 pt-6 pb-0">
                <div className="flex items-center gap-4">
                  <div 
                    className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-sm border border-border flex-shrink-0"
                    style={{
                      backgroundColor: viewTenant.brandColor || 'var(--primary)',
                      color: viewTenant.brandColor ? getContrastColor(viewTenant.brandColor) : 'var(--primary-foreground)'
                    }}
                  >
                    {viewTenant.logoUrl ? (
                      <img src={viewTenant.logoUrl} alt={viewTenant.name} className="h-10 w-10 object-contain" />
                    ) : (
                      <span className="text-2xl font-bold uppercase">{viewTenant.name.substring(0, 2)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-muted text-muted-foreground border-border shadow-none text-[10px] uppercase font-bold">
                        {viewTenant.plan} PLAN
                      </Badge>
                      <Badge variant="outline" className={`shadow-none text-[10px] uppercase font-bold ${viewTenant.status === "ACTIVE" ? "text-success border-success/30 bg-success/10" : viewTenant.status === "SUSPENDED" ? "text-warning border-warning/30 bg-warning/10" : "text-destructive border-destructive/30 bg-destructive/10"}`}>{viewTenant.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-6 px-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{viewTenant.name}</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    {viewTenant.slug}.kwickly.com
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Email</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {viewTenant.email || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Phone</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {viewTenant.phone || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</p>
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {viewTenant.address || "No address configured"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                    <MapPin className="h-5 w-5 text-primary mb-2" />
                    <span className="text-2xl font-bold text-foreground">{viewTenant.branchCount}</span>
                    <span className="text-xs text-muted-foreground">Total Branches</span>
                  </div>
                  <div className="p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
                    <Users className="h-5 w-5 text-[var(--chart-2)] mb-2" />
                    <span className="text-2xl font-bold text-foreground">{viewTenant.userCount}</span>
                    <span className="text-xs text-muted-foreground">Platform Users</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1"
                    onClick={(e) => handleImpersonate(e, viewTenant)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Inspect Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-none px-3"
                    onClick={(e) => {
                      setViewOpen(false);
                      handleEditClick(e, viewTenant);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CREATE DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[450px] bg-card border border-border">
          <form onSubmit={handleCreate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Tenant</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Register a new restaurant group onto the Kwickly platform.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="name" className="text-foreground">Restaurant Group Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swamy Foods"
                  required
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="slug" className="text-foreground">Subdomain Prefix (Slug)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="e.g. swamy"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="email" className="text-foreground">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@restaurant.com"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone" className="text-foreground">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="plan" className="text-foreground">SaaS Plan Tier</Label>
                <Select value={plan} onValueChange={(val: any) => setPlan(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plan..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="STARTER">STARTER</SelectItem>
                    <SelectItem value="GROWTH">GROWTH</SelectItem>
                    <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="brandColor" className="text-foreground">Brand Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="h-10 w-10 rounded border border-border shadow-sm cursor-pointer"
                    style={{ backgroundColor: brandColor }}
                    onClick={() => document.getElementById("plat-color-picker")?.click()}
                  />
                  <Input
                    id="brandColor"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    placeholder="#6366F1"
                    className="font-mono flex-1"
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
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Registering..." : "Register"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[450px] bg-card border border-border">
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Tenant Settings</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Modify billing details or suspend restaurant logins.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid gap-1">
                <Label htmlFor="editName" className="text-foreground">Name</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="editEmail" className="text-foreground">Email</Label>
                  <Input
                    id="editEmail"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="editPhone" className="text-foreground">Phone</Label>
                  <Input
                    id="editPhone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="editPlan" className="text-foreground">Plan</Label>
                <Select value={editPlan} onValueChange={(val: any) => setEditPlan(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE</SelectItem>
                    <SelectItem value="STARTER">STARTER</SelectItem>
                    <SelectItem value="GROWTH">GROWTH</SelectItem>
                    <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="edit-status" className="text-foreground">Platform Status</Label>
                <Select value={editStatus} onValueChange={(val: any) => setEditStatus(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTenantMutation.isPending}>
                {updateTenantMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG WITH CONFIRMATION */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" /> Delete Tenant
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              This will immediately revoke access for all users in <span className="font-bold text-foreground">{deletingTenant?.name}</span>.
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg my-4 space-y-3">
            <Label htmlFor="confirmText" className="text-foreground text-xs uppercase tracking-wider font-semibold">
              Type <span className="text-destructive font-bold select-all">{deletingTenant?.name}</span> to confirm
            </Label>
            <Input
              id="confirmText"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder={deletingTenant?.name}
              className="focus-visible:ring-destructive"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteTenantMutation.isPending || deleteConfirmationText !== deletingTenant?.name}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteTenantMutation.isPending ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
