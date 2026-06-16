import { Shield, Save, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useRolePermissions, useUpdateRolePermissions } from "@/hooks/api/useStaffAttendance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AVAILABLE_PERMISSIONS = [
  { group: "Orders", token: "read:orders", label: "View Orders", desc: "Allows viewing live orders board and past history." },
  { group: "Orders", token: "update:orders", label: "Update Orders", desc: "Allows advancing order statuses (Preparing, Ready, etc)." },
  { group: "Orders", token: "delete:orders", label: "Cancel Orders", desc: "Allows canceling orders and issuing refunds." },
  
  { group: "Menus", token: "read:menus", label: "View Menus", desc: "Allows viewing categories, items, and modifiers." },
  { group: "Menus", token: "write:menus", label: "Create/Edit Menus", desc: "Allows editing prices, item details, and creating modifiers." },
  { group: "Menus", token: "delete:menus", label: "Delete Menus", desc: "Allows soft deleting menu categories and items." },
  
  { group: "HR & Scans", token: "view:staff", label: "View Staff", desc: "Allows viewing employee list and timesheets." },
  { group: "HR & Scans", token: "manage:staff", label: "Onboard Staff", desc: "Allows adding new staff members and managing payroll." },
  { group: "HR & Scans", token: "scan:qr", label: "Scan subscriber QR", desc: "Allows scanner app to scan codes and deduct meals." },
  { group: "HR & Scans", token: "manage:billing", label: "Manage Billing", desc: "Allows subscription plan configuration." },
];

export default function RoleBuilder() {
  const { data: rolesData, isLoading } = useRolePermissions();
  const updateRolePermissionsMutation = useUpdateRolePermissions();

  const [selectedRole, setSelectedRole] = useState<'manager' | 'cashier' | 'kitchen_staff' | 'qr_scanner'>('manager');
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    if (rolesData) {
      const match = rolesData.find(r => r.role === selectedRole);
      setRolePermissions(match ? match.permissions : []);
    }
  }, [rolesData, selectedRole]);

  const togglePermission = (token: string) => {
    setRolePermissions(prev =>
      prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]
    );
  };

  const handleSave = () => {
    updateRolePermissionsMutation.mutate(
      { role: selectedRole, permissions: rolePermissions },
      {
        onSuccess: () => {
          toast.success(`Permissions for ${selectedRole} updated successfully!`);
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
          Custom Role Builder (RBAC)
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
          Select a system role and customize their security tokens to configure fine-grained permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Side: Role Selector */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-2 space-y-1 shadow-sm">
          {(['manager', 'cashier', 'kitchen_staff', 'qr_scanner'] as const).map(role => {
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                {role.replace('_', ' ')}
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
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 capitalize px-2.5 font-semibold text-sm">
                {selectedRole.replace('_', ' ')}
              </Badge>
            </div>
            <Button
              onClick={handleSave}
              disabled={updateRolePermissionsMutation.isPending || isLoading}
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
                    {groupName} Permissions
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
