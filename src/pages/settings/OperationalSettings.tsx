import { Icons } from '@/components/shared/icons';
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { PageHeader } from '@/components/ui/page-header';
import { CardFooter } from '@/components/ui/card';

export default function OperationalSettings() {
  const [dineIn, setDineIn] = useState(true);
  const [takeaway, setTakeaway] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [allowTakeawayOnDineIn, setAllowTakeawayOnDineIn] = useState(false);
  const [dietaryType, setDietaryType] = useState('VEG_AND_NON_VEG');

  // Add-ons States
  const [inventory, setInventory] = useState(false);
  const [payroll, setPayroll] = useState(false);
  const [crm, setCrm] = useState(false);
  const [ai, setAi] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Operational settings updated successfully!");
    }, 1000);
  };

  const toggleAddon = (name: string, current: boolean, setter: (val: boolean) => void) => {
    if (!current) {
      toast.info(`Purchasing premium module: ${name}... Redirecting to check out.`);
    }
    setter(!current);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <PageHeader
        title="Branch Operations"
        description="Configure active customer ordering modes and manage premium B2B add-on modules."
        icon={Icons.ShieldCheck}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Ordering Modes */}
          <Card className="border border-border bg-card shadow-sm flex flex-col flex-1">
            <CardHeader>
              <CardTitle>Ordering Channels</CardTitle>
              <CardDescription>Toggle which guest ordering options are active on your storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="font-semibold text-foreground">Dine-In (QR Table Orders)</p>
                  <p className="text-xs text-muted-foreground">Customers order by scanning table QR codes inside your restaurant.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDineIn(!dineIn)}
                  className="text-primary hover:bg-transparent"
                >
                  {dineIn ? <Icons.ToggleRight className="h-10 w-10 fill-primary" /> : <Icons.ToggleLeft className="h-10 w-10 text-muted-foreground" />}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="font-semibold text-foreground">Takeaway (Self Pick-up)</p>
                  <p className="text-xs text-muted-foreground">Customers place orders online and walk in to pick them up when ready.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setTakeaway(!takeaway)}
                  className="text-primary hover:bg-transparent"
                >
                  {takeaway ? <Icons.ToggleRight className="h-10 w-10 fill-primary" /> : <Icons.ToggleLeft className="h-10 w-10 text-muted-foreground" />}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="font-semibold text-foreground">Delivery Channel</p>
                  <p className="text-xs text-muted-foreground">Customers enter shipping coordinates and order meals to their door step.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDelivery(!delivery)}
                  className="text-primary hover:bg-transparent"
                >
                  {delivery ? <Icons.ToggleRight className="h-10 w-10 fill-primary" /> : <Icons.ToggleLeft className="h-10 w-10 text-muted-foreground" />}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="font-semibold text-foreground">Mixed Fulfillment (Dine-In + Takeaway)</p>
                  <p className="text-xs text-muted-foreground">Allow guests to order additional items for Takeaway while in an active Dine-In session.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setAllowTakeawayOnDineIn(!allowTakeawayOnDineIn)}
                  className="text-primary hover:bg-transparent"
                >
                  {allowTakeawayOnDineIn ? <Icons.ToggleRight className="h-10 w-10 fill-primary" /> : <Icons.ToggleLeft className="h-10 w-10 text-muted-foreground" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Kitchen Settings */}
          <Card className="border border-border bg-card shadow-sm flex flex-col flex-1">
            <CardHeader>
              <CardTitle>Kitchen Settings</CardTitle>
              <CardDescription>Configure kitchen timing and preparation settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border bg-muted/30 gap-4">
                <div>
                  <p className="font-semibold text-foreground">Default Preparation Time</p>
                  <p className="text-xs text-muted-foreground">The estimated time (in minutes) required to prepare an order. Used to show live ETA to customers.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={20}
                    className="flex h-10 w-24 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="text-sm font-medium text-muted-foreground">mins</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between p-4 rounded-lg border border-border bg-muted/30 gap-4">
                <div>
                  <p className="font-semibold text-foreground">Dietary Classification</p>
                  <p className="text-xs text-muted-foreground">Determines menu item validation rules and global customer-facing badges.</p>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value)}
                    className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="PURE_VEG">Pure Veg</option>
                    <option value="VEG_AND_NON_VEG">Veg & Non-Veg</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 flex justify-end shrink-0 mt-auto">
              <Button type="submit" disabled={isSaving} onClick={handleSave}>
                {isSaving ? (
                  <>
                    <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Operations"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col h-full">
          {/* Premium Add-ons */}
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Sparkles className="h-5 w-5 text-warning" />
                Premium Value-Add Modules
              </CardTitle>
              <CardDescription>Activate premium modules to streamline your restaurant B2B operations.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 flex-1">
              {/* Inventory */}
              <div className="p-6 rounded-lg border border-border bg-muted/10 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Icons.PackageCheck className="h-5 w-5" />
                    <span>Inventory & Supply Chain</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Raw materials ledger, automated supplier invoices, recipe breakdown, and warnings on low stock levels.
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-semibold text-warning">₹999 / mo</span>
                  <Button 
                    size="sm" 
                    variant={inventory ? "default" : "outline"}
                    onClick={() => toggleAddon("Inventory & Suppliers", inventory, setInventory)}
                  >
                    {inventory ? "Active" : "Unlock"}
                  </Button>
                </div>
              </div>

              {/* Payroll */}
              <div className="p-6 rounded-lg border border-border bg-muted/10 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Icons.UserCheck className="h-5 w-5" />
                    <span>Payroll & HR Engine</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Clock-in/out attendance rosters, paid leave approvals, automated staff monthly salary runs and payslips.
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-semibold text-warning">₹1,499 / mo</span>
                  <Button 
                    size="sm" 
                    variant={payroll ? "default" : "outline"}
                    onClick={() => toggleAddon("Payroll & HR", payroll, setPayroll)}
                  >
                    {payroll ? "Active" : "Unlock"}
                  </Button>
                </div>
              </div>

              {/* CRM & Loyalty */}
              <div className="p-6 rounded-lg border border-border bg-muted/10 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Icons.Smartphone className="h-5 w-5" />
                    <span>CRM & Loyalty Campaigns</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Loyalty points engine, pre-paid customer digital wallet ledger, and target SMS broadcast campaigns.
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-semibold text-warning">₹999 / mo</span>
                  <Button 
                    size="sm" 
                    variant={crm ? "default" : "outline"}
                    onClick={() => toggleAddon("CRM & Loyalty", crm, setCrm)}
                  >
                    {crm ? "Active" : "Unlock"}
                  </Button>
                </div>
              </div>

              {/* AI kitchen intelligence */}
              <div className="p-6 rounded-lg border border-border bg-muted/10 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Icons.Sparkles className="h-5 w-5 text-warning" />
                    <span>AI Forecasting</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Daily sales demand prediction models, combo deal recommendations, and ingredient consumption projections.
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-semibold text-warning">₹1,999 / mo</span>
                  <Button 
                    size="sm" 
                    variant={ai ? "default" : "outline"}
                    onClick={() => toggleAddon("AI Forecasting", ai, setAi)}
                  >
                    {ai ? "Active" : "Unlock"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
