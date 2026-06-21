import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Shield, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuth';
import { useProfile } from '@/hooks/api/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function UserProfile() {
  const { user } = useAuthStore();
  const { updateProfile } = useProfile();
  const { mutateAsync: updateProfileMutate, isPending: isSaving } = updateProfile;
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user && isEditModalOpen) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user, isEditModalOpen]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await updateProfileMutate({ name, phone });
      toast.success('Profile details saved successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to save profile details');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            My Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            View your personal information and account details.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 dark:bg-zinc-900 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="space-y-0 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-slate-100 dark:border-zinc-800/50">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-2 mb-1 md:mb-0">
                <UserIcon className="h-4 w-4" /> Full Name
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-white">
                {user.name}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-slate-100 dark:border-zinc-800/50">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-2 mb-1 md:mb-0">
                <Mail className="h-4 w-4" /> Email Address
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-white">
                {user.email}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-slate-100 dark:border-zinc-800/50">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-2 mb-1 md:mb-0">
                <Phone className="h-4 w-4" /> Phone Number
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-white">
                {user.phone || <span className="text-slate-400 font-normal italic">Not provided</span>}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-slate-100 dark:border-zinc-800/50">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-2 mb-1 md:mb-0">
                <Shield className="h-4 w-4" /> System Role
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-white capitalize">
                {(user as any).roleDetails?.name || user.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleProfileSave}>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your personal information here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-indigo-600 text-white hover:bg-indigo-700">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
