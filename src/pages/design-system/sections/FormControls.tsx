import { Icons } from '@/components/shared/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export function FormControls() {
  const [sliderValue, setSliderValue] = useState([60]);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <div className="space-y-8">

      {/* Inputs — pattern from BranchProfile.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Text Input <span className="normal-case font-normal text-muted-foreground/70">(from BranchProfile.tsx)</span>
        </h3>
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">

          {/* Normal — exact pattern from BranchProfile */}
          <div className="space-y-2.5 max-w-md">
            <label htmlFor="ds-branch-name" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Icons.Store className="h-4 w-4 text-muted-foreground" />
              Branch Name
            </label>
            <input
              id="ds-branch-name"
              type="text"
              defaultValue="Kwickly Downtown"
              className="w-full min-h-[44px] rounded-md border border-border bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="e.g. Kwickly Downtown"
            />
          </div>

          {/* Error state */}
          <div className="space-y-2.5 max-w-md">
            <label htmlFor="ds-phone" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Icons.Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
              <span className="text-destructive">*</span>
            </label>
            <input
              id="ds-phone"
              type="tel"
              defaultValue="not-a-phone"
              aria-invalid="true"
              className="w-full min-h-[44px] rounded-md border border-destructive bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50 text-foreground"
            />
            <p className="text-xs text-destructive flex items-center gap-2">
              <Icons.AlertCircle className="h-3.5 w-3.5" />
              Please enter a valid phone number.
            </p>
          </div>

          {/* Disabled */}
          <div className="space-y-2.5 max-w-md">
            <label htmlFor="ds-slug" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Icons.Globe className="h-4 w-4 text-muted-foreground" />
              Tenant Slug
              <span className="text-xs text-muted-foreground font-normal">(read-only)</span>
            </label>
            <input
              id="ds-slug"
              type="text"
              defaultValue="kwickly-downtown"
              disabled
              className="w-full min-h-[44px] rounded-md border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>

        </div>
      </div>

      {/* Shadcn Input */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Shadcn Input Component
        </h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="max-w-sm space-y-4">
            <div className="space-y-2.5">
              <Label htmlFor="ds-email">Email Address</Label>
              <Input id="ds-email" type="email" placeholder="admin@restaurant.com" />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="ds-pw">Password</Label>
              <div className="relative">
                <Input id="ds-pw" type="password" placeholder="••••••••" className="pr-10" />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none rounded-md"
                >
                  <Icons.Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Textarea — from BranchProfile.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Textarea</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="space-y-2.5 max-w-md">
            <label htmlFor="ds-address" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Icons.MapPin className="h-4 w-4 text-muted-foreground" />
              Address
            </label>
            <textarea
              id="ds-address"
              rows={3}
              defaultValue="123 Restaurant Row, Food District, Mumbai 400001"
              className="w-full min-h-[44px] rounded-md border border-border bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
              placeholder="Enter full address"
            />
          </div>
        </div>
      </div>

      {/* Select — from TenantBranding.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="max-w-xs space-y-2.5">
            <Label>Appearance Mode</Label>
            <Select defaultValue="system">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System Default</SelectItem>
                <SelectItem value="light">Always Light</SelectItem>
                <SelectItem value="dark">Always Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Switch — from TenantBranding.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Switch</h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between max-w-sm pt-2">
            <div className="space-y-2">
              <Label className="text-base font-medium">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive emails about new products.</p>
            </div>
            <Switch
              checked={switchOn}
              onCheckedChange={setSwitchOn}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Slider — from TenantBranding.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Slider <span className="normal-case font-normal text-muted-foreground/70">(from TenantBranding.tsx)</span>
        </h3>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Primary Hue</Label>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-mono">{sliderValue[0]}</span>
            </div>
            <Slider
              value={sliderValue}
              min={0}
              max={360}
              step={1}
              onValueChange={(v) => setSliderValue(v)}
              className="cursor-grab active:cursor-grabbing"
            />
            {/* eslint-disable-next-line no-restricted-syntax */}
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Full Settings Form — from BranchProfile.tsx */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Settings Form Card <span className="normal-case font-normal text-muted-foreground/70">(from BranchProfile.tsx)</span>
        </h3>
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <form className="p-6 space-y-6">
            <div className="max-w-xl space-y-4">
              <div className="space-y-4">
                <label htmlFor="ds-form-name" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Icons.Store className="h-4 w-4 text-muted-foreground" />
                  Branch Name
                </label>
                <input
                  id="ds-form-name"
                  type="text"
                  defaultValue="Kwickly Downtown"
                  className="w-full min-h-[44px] rounded-md border border-border bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="e.g. Kwickly Downtown"
                />
              </div>
              <div className="space-y-4">
                <label htmlFor="ds-form-phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Icons.Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </label>
                <input
                  id="ds-form-phone"
                  type="tel"
                  defaultValue="+91 98765 43210"
                  className="w-full min-h-[44px] rounded-md border border-border bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Icons.Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
