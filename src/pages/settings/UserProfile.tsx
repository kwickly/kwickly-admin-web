import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuth';
import { useProfile } from '@/hooks/api/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UserProfile() {
  const { user } = useAuthStore();
  const { updateProfile } = useProfile();
  const { mutateAsync: updateProfileMutate, isPending: isSaving } = updateProfile;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await updateProfileMutate({ name, phone });
      toast.success('Profile details saved successfully');
    } catch (error) {
      toast.error('Failed to save profile details');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          My Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
        <form onSubmit={handleProfileSave} className="p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-slate-400" />
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500"
              />
              <p className="text-xs text-slate-500">Email address cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
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

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-400" />
                System Role
              </label>
              <div className="px-3 py-2 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50">
                <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 capitalize">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-zinc-800">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
