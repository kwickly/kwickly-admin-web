import React, { useState, useEffect } from 'react';
import { Store, Phone, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useBranches, useUpdateBranch } from '@/hooks/api/useSettings';
import { FormSkeleton } from '@/components/ui/loaders';

export default function BranchProfile() {
  const { data: branches, isLoading: isBranchLoading } = useBranches();
  const { mutateAsync: updateBranch, isPending: isBranchSaving } = useUpdateBranch();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const currentBranch = branches?.[0];

  useEffect(() => {
    if (currentBranch) {
      setName(currentBranch.name || '');
      setPhone(currentBranch.phone || '');
      setAddress(currentBranch.address || '');
    }
  }, [currentBranch]);

  const handleBranchSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranch) return;
    try {
      await updateBranch({
        id: currentBranch.id,
        payload: { name, phone, address },
      });
      toast.success('Branch details saved successfully');
    } catch (error) {
      toast.error('Failed to save branch details');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          Branch Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your public-facing restaurant information.
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        <form onSubmit={handleBranchSave} className="p-6 space-y-6">
          {isBranchLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <div className="space-y-4 max-w-xl">
                <div className="space-y-4">
                  <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    Branch Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full min-h-[44px] rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="e.g. Kwickly Downtown"
                  />
                </div>

                <div className="space-y-4">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[44px] rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="e.g. (555) 123-4567"
                  />
                </div>

                <div className="space-y-4">
                  <label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full min-h-[44px] rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isBranchSaving || !currentBranch}
                  className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Save className="h-4 w-4" />
                  {isBranchSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
