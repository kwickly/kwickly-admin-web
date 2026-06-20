import { Shield, Save, Lock, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRoles, useUpdateRolePermissions, usePlatformRoles, useUpdatePlatformRolePermissions, useDeleteRole, useDeletePlatformRole } from "@/hooks/api/useStaff";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const tenantRoles = useRoles();
  const platformRoles = usePlatformRoles();
  
  const { data: roles, isLoading } = isPlatform ? platformRoles : tenantRoles;
  
  const updateTenantMutation = useUpdateRolePermissions();
  const updatePlatformMutation = useUpdatePlatformRolePermissions();
  const deleteTenantMutation = useDeleteRole();
  const deletePlatformMutation = useDeletePlatformRole();
  
  const updateRolePermissionsMutation = isPlatform ? updatePlatformMutation : updateTenantMutation;
  const deleteRoleMutation = isPlatform ? deletePlatformMutation : deleteTenantMutation;

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Group permissions
  const groups = AVAILABLE_PERMISSIONS.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PERMISSIONS>);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles?.map(role => (
          <div key={role.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors">
            <div className="p-5 border-b border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-800/20 flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {role.name}
                  {role.isSystem && <Lock className="h-3 w-3 text-slate-400" />}
                </h3>
                {role.isSystem ? (
                  <Badge variant="outline" className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 uppercase tracking-tighter bg-indigo-50 dark:bg-indigo-500/10">
                    System Role
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-2 text-[10px] text-slate-500 uppercase tracking-tighter">
                    Custom Role
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">{role.permissions.length}</span> active permissions
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((p: any) => (
                    <span key={p.permission?.slug || p} className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md text-[10px] truncate max-w-[100px]">
                      {p.permission?.slug || p}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md text-[10px]">
                      +{role.permissions.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Configure
                </Button>
                {((isPlatform || !role.isSystem) && (user?.role === 'platform_owner' || user?.role === 'tenant_owner' || user?.role === 'super_admin')) && (
                  <Button 
                    variant="outline" 
                    className="w-10 px-0 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10"
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

      <Dialog open={!!deleteRoleId} onOpenChange={(open) => !open && setDeleteRoleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone. You can only delete roles that have no active staff members assigned to them.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteRoleId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteRoleId && deleteRoleMutation.mutate(deleteRoleId)} disabled={deleteRoleMutation.isPending}>
              {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row justify-between items-center pr-6 sticky top-0 bg-white dark:bg-zinc-950 z-10 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2">
                Configuring: 
                <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2.5 font-semibold text-sm">
                  {selectedRole?.name}
                </Badge>
                {selectedRole?.isSystem && (
                  <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200 uppercase tracking-tighter">
                    System Role
                  </Badge>
                )}
              </DialogTitle>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Turn modules on or off for this specific role.
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={updateRolePermissionsMutation.isPending || isLoading || !selectedRoleId}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-9"
            >
              <Save className="h-4 w-4" /> Save Configuration
            </Button>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {Object.entries(groups).map(([groupName, perms]) => (
              <div key={groupName} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
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
                          !canAssign ? 'opacity-60 bg-slate-50 dark:bg-zinc-900 cursor-not-allowed border-slate-200 dark:border-zinc-800' :
                          isChecked
                            ? 'cursor-pointer border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/30 dark:bg-indigo-500/5'
                            : 'cursor-pointer border-slate-200 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                            {p.label}
                            {!canAssign && (
                              <span title="You don't have this permission">
                                <Lock className="h-3 w-3 text-slate-400" />
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-[200px] leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                        <Switch 
                          disabled={!canAssign}
                          checked={isChecked} 
                          onCheckedChange={() => togglePermission(p.token)} 
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
