import { Shield, Save, Lock, Edit2, Trash2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRoles, useUpdateRolePermissions, usePlatformRoles, useUpdatePlatformRolePermissions, useDeleteRole, useDeletePlatformRole, useCreateRole, usePermissions } from "@/hooks/api/useStaff";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useAuthStore } from "@/store/useAuth";
import { toast } from "sonner";

const AVAILABLE_PERMISSIONS = [
  { group: "Orders", token: "orders:read", label: "View Orders", desc: "Allows viewing live orders board and past history." },
  { group: "Orders", token: "orders:write", label: "Manage Orders", desc: "Allows advancing order statuses, canceling orders, and refunds." },
  
  { group: "Menus", token: "menu:read", label: "View Menus", desc: "Allows viewing categories, items, and modifiers." },
  { group: "Menus", token: "menu:write", label: "Manage Menus", desc: "Allows creating, editing, and deleting menu items." },
  
  { group: "Staff & HR", token: "staff:read", label: "View Staff", desc: "Allows viewing employee list and timesheets." },
  { group: "Staff & HR", token: "staff:write", label: "Manage Staff", desc: "Allows onboarding new staff and managing roles." },
  
  { group: "Analytics", token: "analytics:read", label: "View Analytics", desc: "Allows viewing sales reports and performance metrics." },
  
  { group: "Inventory", token: "inventory:read", label: "View Inventory", desc: "Allows viewing stock levels and supplies." },
  { group: "Inventory", token: "inventory:write", label: "Manage Inventory", desc: "Allows updating stock levels and orders." },
];

export default function RoleBuilder({ isPlatform = false }: { isPlatform?: boolean }) {
  const { user } = useAuthStore();
  const tenantRoles = useRoles(!isPlatform);
  const platformRoles = usePlatformRoles(isPlatform);
  
  const { data: roles, isLoading } = isPlatform ? platformRoles : tenantRoles;
  
  const updateTenantMutation = useUpdateRolePermissions();
  const updatePlatformMutation = useUpdatePlatformRolePermissions();
  const deleteTenantMutation = useDeleteRole();
  const deletePlatformMutation = useDeletePlatformRole();
  const createTenantRoleMutation = useCreateRole();
  
  const updateRolePermissionsMutation = isPlatform ? updatePlatformMutation : updateTenantMutation;
  const deleteRoleMutation = isPlatform ? deletePlatformMutation : deleteTenantMutation;
  const createRoleMutation = isPlatform ? null : createTenantRoleMutation;

  const { data: dbPermissions } = usePermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 9; // 3x3 grid


  const currentUser = useAuthStore(state => state.user);
  const isPlatformOwner = currentUser?.role === 'platform_owner' || currentUser?.role === 'super_admin';
  const currentUserPermissions = currentUser?.roleDetails?.permissions || [];

  const selectedRole = roles?.find(r => r.id === selectedRoleId);

  useEffect(() => {
    if (selectedRole) {
      setRolePermissions(selectedRole.permissions);
    }
  }, [selectedRole]);

  const togglePermission = (token: string) => {
    setRolePermissions(prev =>
      prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]
    );
  };

  const handleSave = () => {
    if (!selectedRoleId) return;
    
    updateRolePermissionsMutation.mutate(
      { id: selectedRoleId, permissions: rolePermissions },
      {
        onSuccess: () => {
          toast.success(`Permissions for ${selectedRole?.name} updated successfully!`);
          setIsDialogOpen(false);
        }
      }
    );
  };

  const handleCreate = () => {
    if (!newRoleName.trim() || !createRoleMutation) return;
    
    createRoleMutation.mutate(
      { name: newRoleName, permissions: newRolePermissions },
      {
        onSuccess: () => {
          toast.success(`Role ${newRoleName} created successfully!`);
          setIsCreateDialogOpen(false);
          setNewRoleName("");
          setNewRolePermissions([]);
        }
      }
    );
  };

  const toggleCreatePermission = (token: string) => {
    setNewRolePermissions(prev =>
      prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]
    );
  };

  // Merge DB permissions with AVAILABLE_PERMISSIONS to get groups
  const mergedPermissions = (dbPermissions || []).map(dbP => {
    const existing = AVAILABLE_PERMISSIONS.find(p => p.token === dbP.slug);
    return {
      group: existing?.group || "General",
      token: dbP.slug,
      label: dbP.name || existing?.label || dbP.slug,
      desc: dbP.description || existing?.desc || ""
    };
  });

  // Group permissions
  const groups = mergedPermissions.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PERMISSIONS>);

  return (
    <div className="space-y-6">
      {!isPlatform && (
        <div className="flex justify-end">
          <Button onClick={() => setIsCreateDialogOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" /> Create Custom Role
          </Button>
        </div>
      )}

      {roles && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.slice((page - 1) * pageSize, page * pageSize).map(role => (
          <div key={role.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col hover:border-primary/40 transition-colors">
            <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                  {role.name}
                  {role.isSystem && <Lock className="h-3 w-3 text-muted-foreground/60" />}
                </h3>
                {role.isSystem ? (
                  <Badge variant="outline" className="mt-2 text-[10px] text-primary border-primary/20 bg-primary/10 uppercase tracking-tighter">
                    System Role
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-2 text-[10px] text-muted-foreground border-border uppercase tracking-tighter">
                    Custom Role
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <div className="p-5 flex-1 min-w-0 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{role.permissions.length}</span> active permissions
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((p: any) => (
                    <span key={p.permission?.slug || p} className="px-2 py-0.5 bg-muted text-muted-foreground rounded-md text-[10px] truncate max-w-[100px]">
                      {p.permission?.slug || p}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-md text-[10px]">
                      +{role.permissions.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 min-w-0 text-primary border-primary/25 hover:bg-primary/10 cursor-pointer"
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Configure
                </Button>
                {(!role.isSystem && (user?.role === 'platform_owner' || user?.role === 'tenant_owner' || user?.role === 'super_admin')) && (
                  <Button 
                    variant="outline" 
                    className="w-10 px-0 text-destructive border-destructive/25 hover:bg-destructive/10 cursor-pointer"
                    onClick={() => setDeleteRoleId(role.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          ))}
          </div>
          {roles.length > pageSize && (
            <div className="mt-4">
              <PaginationControls
                page={page}
                totalPages={Math.ceil(roles.length / pageSize)}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <Dialog open={!!deleteRoleId} onOpenChange={(open) => !open && setDeleteRoleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone. You can only delete roles that have no active staff members assigned to them.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" className="cursor-pointer" onClick={() => setDeleteRoleId(null)}>Cancel</Button>
            <Button variant="destructive" className="cursor-pointer" onClick={() => deleteRoleId && deleteRoleMutation.mutate(deleteRoleId)} disabled={deleteRoleMutation.isPending}>
              {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0" showCloseButton={false}>
          <DialogHeader className="flex flex-row justify-between items-center px-6 pt-6 sticky top-0 bg-popover z-10 pb-4 border-b border-border">
            <div className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2">
                Configuring: 
                <Badge className="bg-primary/10 text-primary border border-primary/20 px-2.5 font-semibold text-sm">
                  {selectedRole?.name}
                </Badge>
                {selectedRole?.isSystem && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground border-border uppercase tracking-tighter">
                    System Role
                  </Badge>
                )}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Turn modules on or off for this specific role.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 cursor-pointer text-muted-foreground hover:bg-muted"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 px-6 pb-6 pt-4">
            {Object.entries(groups).map(([groupName, perms]) => (
              <div key={groupName} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {groupName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {perms.map(p => {
                    const isChecked = rolePermissions.includes(p.token);
                    const canAssign = isPlatformOwner || currentUserPermissions.includes(p.token);

                    return (
                      <div
                        key={p.token}
                        onClick={() => canAssign && togglePermission(p.token)}
                        className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                          !canAssign ? 'opacity-60 bg-muted/40 cursor-not-allowed border-border' :
                          isChecked
                            ? 'cursor-pointer border-primary/30 bg-primary/5'
                            : 'cursor-pointer border-border hover:bg-muted/50'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                            {p.label}
                            {!canAssign && (
                              <span title="You don't have this permission">
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                        <Switch 
                          disabled={!canAssign}
                          checked={isChecked} 
                          onCheckedChange={() => togglePermission(p.token)} 
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="m-0 mt-0 sticky bottom-0 bg-popover z-10 p-4 px-6 border-t border-border rounded-none rounded-b-lg">
            <Button variant="outline" className="h-9 cursor-pointer" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={updateRolePermissionsMutation.isPending || isLoading || !selectedRoleId}
              className="bg-primary hover:bg-primary/95 text-primary-foreground flex items-center gap-2 h-9 cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row justify-between items-center pr-6 sticky top-0 bg-popover z-10 pb-4 border-b border-border">
            <div className="space-y-1 text-left w-full max-w-md">
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>
                Define a new role and configure its permissions.
              </DialogDescription>
            </div>
            <Button
              onClick={handleCreate}
              disabled={!newRoleName.trim() || createRoleMutation?.isPending}
              className="bg-primary hover:bg-primary/95 text-primary-foreground flex items-center gap-2 h-9 cursor-pointer"
            >
              <Save className="h-4 w-4" /> Save Custom Role
            </Button>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Role Name</h3>
              <Input
                placeholder="e.g. Shift Supervisor"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="max-w-md"
              />
            </div>

            {Object.entries(groups).map(([groupName, perms]) => (
              <div key={groupName} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {groupName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {perms.map(p => {
                    const isChecked = newRolePermissions.includes(p.token);
                    const canAssign = isPlatformOwner || currentUserPermissions.includes(p.token);

                    return (
                      <div
                        key={p.token}
                        onClick={() => canAssign && toggleCreatePermission(p.token)}
                        className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                          !canAssign ? 'opacity-60 bg-muted/40 cursor-not-allowed border-border' :
                          isChecked
                            ? 'cursor-pointer border-primary/30 bg-primary/5'
                            : 'cursor-pointer border-border hover:bg-muted/50'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                            {p.label}
                            {!canAssign && (
                              <span title="You don't have this permission">
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                        <Switch 
                          disabled={!canAssign}
                          checked={isChecked} 
                          onCheckedChange={() => toggleCreatePermission(p.token)} 
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
