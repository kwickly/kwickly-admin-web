import { Shield, Save, Check, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRoles, useUpdateRolePermissions } from "@/hooks/api/useStaff";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function RoleBuilder() {
  const { data: roles, isLoading } = useRoles();
  const updateRolePermissionsMutation = useUpdateRolePermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  const selectedRole = roles?.find(r => r.id === selectedRoleId) || roles?.[0];

  useEffect(() => {
    if (roles && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

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
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Granular Role Permissions
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
          Customize security tokens for each role. Changes take effect immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Side: Role Selector */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-2 space-y-1 shadow-sm">
          {roles?.map(role => {
            const isActive = selectedRoleId === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{role.name}</span>
                  {role.isSystem && <Lock className={`h-3 w-3 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Permissions Grid */}
        <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100 uppercase tracking-wide">
                Configuring:
              </span>
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2.5 font-semibold text-sm">
                {selectedRole?.name}
              </Badge>
              {selectedRole?.isSystem && (
                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200 uppercase tracking-tighter">
                  System Role
                </Badge>
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={updateRolePermissionsMutation.isPending || isLoading || !selectedRoleId}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-9"
            >
              <Save className="h-4 w-4" /> Save Configuration
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-6 text-slate-500">Loading permissions...</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groups).map(([groupName, perms]) => (
                <div key={groupName} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    {groupName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {perms.map(p => {
                      const isChecked = rolePermissions.includes(p.token);
                      return (
                        <div
                          key={p.token}
                          onClick={() => togglePermission(p.token)}
                          className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${
                            isChecked
                              ? 'border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-500/5'
                              : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300 dark:border-zinc-700 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-zinc-150">
                              {p.label}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                              {p.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
