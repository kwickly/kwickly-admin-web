import React, { useState, useEffect } from "react";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuth";
import { useProfile } from "@/hooks/api/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageDropzone from "@/components/ui/image-dropzone";

export default function UserProfile() {
  const { user } = useAuthStore();
  const { updateProfile } = useProfile();
  const { mutateAsync: updateProfileMutate, isPending: isSaving } =
    updateProfile;

  // State for Personal Info
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("UTC");

  // State for Contact Info
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      queueMicrotask(() => {
        setName(user.name || "");
        setPhone(user.phone || "");
        setJobTitle(user.jobTitle || "");
        setBio(user.bio || "");
        setTimezone(user.timezone || "UTC");
        setAvatarUrl(user.avatarUrl || "");
      });
    }
  }, [user]);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    try {
      await updateProfileMutate({
        name,
        phone,
        jobTitle,
        timezone,
        bio,
        avatarUrl,
      });
      toast.success("Profile details saved successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarChange = async (url: string) => {
    setAvatarUrl(url);
    if (!user) return;

    try {
      await updateProfileMutate({ avatarUrl: url });
      toast.success("Profile picture updated successfully");
    } catch {
      toast.error("Failed to update profile picture");
    }
  };

  if (!user) return null;

  const roleName =
    (user as unknown as Record<string, any>).roleDetails?.name ||
    user?.role?.replace("_", " ") ||
    "User";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
        icon={Icons.User}
      />

      {/* Modular Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Main Panel: Personal Info & Summary */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveProfile} className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic profile details visible to other team
                  members.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 flex-1">
                {/* Avatar & Role */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-border/50">
                  {/* Avatar Column */}
                  <div className="flex items-center gap-6">
                    <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-border shadow-sm bg-muted shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      {/* Upload Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 flex flex-col items-center justify-center cursor-pointer backdrop-blur-[2px]">
                        <ImageDropzone
                          value={avatarUrl}
                          onChange={handleAvatarChange}
                          className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Icons.Camera className="w-5 h-5 text-white pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Profile Photo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hover to upload a new image.
                        <br />
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  {/* Role Badge Column */}
                  <div className="flex items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-platform-primary/10 text-platform-primary text-xs font-medium capitalize border border-platform-primary/20">
                      <Icons.Shield className="w-3.5 h-3.5" />
                      {roleName}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Manager"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a few sentences about yourself and your role..."
                    className="min-h-[120px] resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 flex justify-end shrink-0 mt-auto">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Right Sidebar Panel: Contact & Regional */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSaveProfile} className="h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Contact & Regional</CardTitle>
                <CardDescription>
                  Manage your contact details and localized settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Icons.Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="pl-9 bg-muted/50 text-muted-foreground"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Email cannot be changed directly.
                  </p>
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
                      placeholder="+1 (555) 000-0000"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" className="w-full">
                      <div className="flex items-center gap-2">
                        <Icons.Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="Select timezone" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">
                        UTC (Universal Coordinated Time)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        EST (Eastern)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        CST (Central)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        MST (Mountain)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        PST (Pacific)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        GMT (Greenwich)
                      </SelectItem>
                      <SelectItem value="Asia/Kolkata">IST (Indian)</SelectItem>
                      <SelectItem value="Asia/Singapore">
                        SGT (Singapore)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 flex justify-end shrink-0">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
