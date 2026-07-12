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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" />
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View your personal information and account details.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              variant="outline"
              className="bg-transparent border-border text-foreground hover:bg-muted/50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="max-w-7xl mx-auto space-y-0 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1 md:mb-0">
                <UserIcon className="h-4 w-4" /> Full Name
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-foreground">
                {user.name}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1 md:mb-0">
                <Mail className="h-4 w-4" /> Email Address
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-foreground">
                {user.email}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1 md:mb-0">
                <Phone className="h-4 w-4" /> Phone Number
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-foreground">
                {user.phone || <span className="text-muted-foreground font-normal italic">Not provided</span>}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 py-4 border-b border-border/50">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1 md:mb-0">
                <Shield className="h-4 w-4" /> System Role
              </span>
              <span className="md:col-span-2 text-sm font-semibold text-foreground capitalize">
                {(user as any).roleDetails?.name || user.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <form onSubmit={handleProfileSave}>
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Make changes to your personal information here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-transparent border-border text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-transparent border-border text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
