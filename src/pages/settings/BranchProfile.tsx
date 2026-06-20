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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          Branch Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Update your public-facing restaurant information.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
        <form onSubmit={handleBranchSave} className="p-6 space-y-6">
          {isBranchLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <div className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                    <Store className="h-4 w-4 text-slate-400" />
                    Branch Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="e.g. Kwickly Downtown"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="e.g. (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-zinc-800">
                <button
                  type="submit"
                  disabled={isBranchSaving || !currentBranch}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
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
