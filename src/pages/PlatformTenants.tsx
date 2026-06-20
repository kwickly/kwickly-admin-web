import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Plus, Eye, Edit, Trash, ShieldAlert, MoreVertical, MapPin, Users, Phone, Mail, Globe } from "lucide-react";
import { useAuthStore } from "@/store/useAuth";
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

export default function PlatformTenants() {
  const navigate = useNavigate();
  const setImpersonatedTenant = useAuthStore((state) => state.setImpersonatedTenant);
  const [page, setPage] = useState(1);
  const { data: response, isLoading: isTenantsLoading } = usePlatformTenants(page, 12);
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
  const [editIsActive, setEditIsActive] = useState(true);

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
          // Also update the view modal if it's open
          if (viewOpen && viewTenant?.id === editingTenant.id) {
            setViewTenant({
              ...viewTenant,
              name: editName,
              email: editEmail,
              phone: editPhone,
              address: editAddress,
              plan: editPlan,
              isActive: editIsActive,
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

      {isTenantsLoading ? (
        <GridCardSkeleton count={8} />
      ) : !tenantsList || tenantsList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <Building className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No tenants registered yet</h3>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">Get started by registering a new restaurant group.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tenantsList.map((tenant) => (
            <Card 
              key={tenant.id} 
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full relative"
              onClick={() => handleCardClick(tenant)}
            >
              <div 
                className="absolute top-0 left-0 w-full h-1" 
                style={{ backgroundColor: tenant.brandColor || '#6366F1' }} 
              />
              
              <div className="p-5 flex flex-col h-full relative">
                {/* 3 Dots Menu */}
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-lg rounded-xl">
                      <DropdownMenuItem 
                        onClick={(e) => handleImpersonate(e, tenant)}
                        className="cursor-pointer text-indigo-600 dark:text-indigo-400 focus:bg-indigo-50 dark:focus:bg-indigo-950/50 focus:text-indigo-700 dark:focus:text-indigo-300"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Inspect Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                      <DropdownMenuItem 
                        onClick={(e) => handleEditClick(e, tenant)}
                        className="cursor-pointer text-slate-700 dark:text-zinc-300 focus:bg-slate-50 dark:focus:bg-zinc-900"
                      >
                        <Edit className="mr-2 h-4 w-4 text-slate-500" />
                        <span>Edit Configuration</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteClick(e, tenant)}
                        className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50 focus:text-red-700 dark:focus:text-red-300"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete Tenant</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-start gap-4 mb-4 pr-8">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: tenant.brandColor || '#6366F1' }}
                  >
                    {tenant.logoUrl ? (
                      <img src={tenant.logoUrl} alt={tenant.name} className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="text-xl font-bold uppercase">{tenant.name.substring(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-zinc-100 truncate w-full group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tenant.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5 truncate flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {tenant.slug}.kwickly.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Badge className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-none text-[10px] uppercase font-bold shadow-none">
                    {tenant.plan}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className={`h-2 w-2 rounded-full ${tenant.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
                    <span className={tenant.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                      {tenant.isActive ? "ACTIVE" : "SUSPENDED"}
                    </span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">{tenant.branchCount} <span className="text-xs font-normal">loc</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">{tenant.userCount} <span className="text-xs font-normal">users</span></span>
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
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-0 overflow-hidden shadow-xl rounded-2xl">
          {viewTenant && (
            <>
              <div 
                className="h-24 w-full relative"
                style={{ background: `linear-gradient(to right, ${viewTenant.brandColor}80, ${viewTenant.brandColor}20)` }}
              >
                <div className="absolute -bottom-10 left-6">
                  <div 
                    className="h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-md border-4 border-white dark:border-zinc-950"
                    style={{ backgroundColor: viewTenant.brandColor || '#6366F1' }}
                  >
                    {viewTenant.logoUrl ? (
                      <img src={viewTenant.logoUrl} alt={viewTenant.name} className="h-12 w-12 object-contain" />
                    ) : (
                      <span className="text-3xl font-bold uppercase">{viewTenant.name.substring(0, 2)}</span>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-white/90 text-slate-900 border-none shadow-sm backdrop-blur-sm">
                    {viewTenant.plan} PLAN
                  </Badge>
                  <Badge variant={viewTenant.isActive ? "outline" : "destructive"} className={`bg-white/90 backdrop-blur-sm border-none shadow-sm ${viewTenant.isActive ? 'text-emerald-700' : ''}`}>
                    {viewTenant.isActive ? "ACTIVE" : "SUSPENDED"}
                  </Badge>
                </div>
              </div>

              <div className="pt-14 pb-6 px-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{viewTenant.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 font-mono mt-1 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    {viewTenant.slug}.kwickly.com
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Contact Email</p>
                    <p className="text-sm text-slate-900 dark:text-zinc-200 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {viewTenant.email || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Contact Phone</p>
                    <p className="text-sm text-slate-900 dark:text-zinc-200 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {viewTenant.phone || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Address</p>
                    <p className="text-sm text-slate-900 dark:text-zinc-200 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {viewTenant.address || "No address configured"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                    <MapPin className="h-5 w-5 text-indigo-500 mb-2" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{viewTenant.branchCount}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Total Branches</span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                    <Users className="h-5 w-5 text-emerald-500 mb-2" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{viewTenant.userCount}</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Platform Users</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                    onClick={(e) => handleImpersonate(e, viewTenant)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Inspect Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-none px-3 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    onClick={(e) => {
                      setViewOpen(false);
                      handleEditClick(e, viewTenant);
                    }}
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-zinc-300" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
              <Button type="submit" disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isCreating ? "Registering..." : "Register"}
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

      {/* DELETE DIALOG WITH CONFIRMATION */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" /> Delete Tenant
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400 mt-2">
              This will immediately revoke access for all users in <span className="font-bold text-slate-900 dark:text-white">{deletingTenant?.name}</span>.
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-4 rounded-lg my-4 space-y-3">
            <Label htmlFor="confirmText" className="text-slate-700 dark:text-zinc-300 text-xs uppercase tracking-wider font-semibold">
              Type <span className="text-red-600 dark:text-red-400 font-bold select-all">{deletingTenant?.name}</span> to confirm
            </Label>
            <Input
              id="confirmText"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder={deletingTenant?.name}
              className="bg-white dark:bg-zinc-900 border-red-200 dark:border-red-800/50 focus-visible:ring-red-500 text-slate-900 dark:text-zinc-100"
            />
          </div>

          <DialogFooter>
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
              disabled={deleteTenantMutation.isPending || deleteConfirmationText !== deletingTenant?.name}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:bg-red-600"
            >
              {deleteTenantMutation.isPending ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
