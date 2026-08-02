import { Icons } from "@/components/shared/icons";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  useBranches,
  useUpdateBranch,
  useCreateBranch,
  type Branch,
} from "@/hooks/api/useSettings";
import { FormSkeleton } from "@/components/ui/loaders";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BranchProfile() {
  const { data: branches, isLoading: isBranchLoading } = useBranches();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Branches"
          description="Manage your physical restaurant locations."
          icon={Icons.Store}
        />

        {/* Add Branch Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger
            render={
              <Button>
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Create a new branch location for your restaurant.
              </DialogDescription>
            </DialogHeader>
            <BranchForm
              onSuccess={() => setIsAddModalOpen(false)}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isBranchLoading ? (
        <FormSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches?.map((branch) => (
            <Card 
              key={branch.id}
              className="bg-card p-6 rounded-xl border border-border flex flex-col h-full"
            >
              {/* Header (Top of Z) */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                    <Icons.Store className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-foreground leading-tight truncate">
                      {branch.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono mt-1 flex items-center gap-1 uppercase">
                       <Icons.Hash className="h-3 w-3" /> {branch.id.substring(0,8)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-2 shrink-0 shadow-none text-[10px] px-2 py-0.5 uppercase font-bold ${
                    branch.isActive
                      ? "text-success border-success/30 bg-success/10"
                      : "text-muted-foreground border-border bg-muted"
                  }`}
                >
                  {branch.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Info Body (Diagonal down) */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-3">
                  <Icons.MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-foreground leading-snug">
                    {branch.address || "No address provided"}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Icons.Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {branch.phone || "No phone provided"}
                  </span>
                </div>
              </div>

              {/* Footer (Bottom of Z) */}
              <div className="mt-8 flex items-center justify-between pt-4 border-t border-border/50">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Icons.Calendar className="h-3.5 w-3.5" />
                  Added {new Date(branch.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingBranch(branch)}
                  className="h-8"
                >
                  Manage
                </Button>
              </div>
            </Card>
          ))}

          {/* Edit Branch Modal */}
          <Dialog
            open={!!editingBranch}
            onOpenChange={(open) => !open && setEditingBranch(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Branch</DialogTitle>
                <DialogDescription>
                  Update the details for this specific branch.
                </DialogDescription>
              </DialogHeader>
              {editingBranch && (
                <BranchForm
                  initialData={editingBranch}
                  onSuccess={() => setEditingBranch(null)}
                  onCancel={() => setEditingBranch(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

interface BranchFormProps {
  initialData?: Branch;
  onSuccess: () => void;
  onCancel: () => void;
}

function BranchForm({ initialData, onSuccess, onCancel }: BranchFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [address, setAddress] = useState(initialData?.address || "");

  const { mutateAsync: createBranch, isPending: isCreating } =
    useCreateBranch();
  const { mutateAsync: updateBranch, isPending: isUpdating } =
    useUpdateBranch();

  const isSaving = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateBranch({
          id: initialData.id,
          payload: { name, phone, address },
        });
        toast.success("Branch details saved successfully");
      } else {
        await createBranch({ name, phone, address });
        toast.success("Branch created successfully");
      }
      onSuccess();
    } catch {
      toast.error(
        initialData
          ? "Failed to save branch details"
          : "Failed to create branch",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Branch Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kwickly Downtown"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Icons.Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <div className="relative">
            <Icons.MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address"
              className="min-h-[120px] resize-y pl-10"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
