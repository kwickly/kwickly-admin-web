import { useState } from "react";
import { ShieldCheck, ToggleLeft, ToggleRight, Sparkles, UserCheck, Smartphone, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function OperationalSettings() {
  const [dineIn, setDineIn] = useState(true);
  const [takeaway, setTakeaway] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [allowTakeawayOnDineIn, setAllowTakeawayOnDineIn] = useState(false);

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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Branch Operations
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure active customer ordering modes and manage premium B2B add-on modules.
        </p>
      </div>

      {/* Ordering Modes */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Ordering Channels</CardTitle>
          <CardDescription>Toggle which guest ordering options are active on your storefront.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
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
              {dineIn ? <ToggleRight className="h-10 w-10 fill-primary" /> : <ToggleLeft className="h-10 w-10 text-muted-foreground" />}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
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
              {takeaway ? <ToggleRight className="h-10 w-10 fill-primary" /> : <ToggleLeft className="h-10 w-10 text-muted-foreground" />}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
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
              {delivery ? <ToggleRight className="h-10 w-10 fill-primary" /> : <ToggleLeft className="h-10 w-10 text-muted-foreground" />}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
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
              {allowTakeawayOnDineIn ? <ToggleRight className="h-10 w-10 fill-primary" /> : <ToggleLeft className="h-10 w-10 text-muted-foreground" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kitchen Settings */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Kitchen Settings</CardTitle>
          <CardDescription>Configure kitchen timing and preparation settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border bg-muted/30 gap-4">
            <div>
              <p className="font-semibold text-foreground">Default Preparation Time</p>
              <p className="text-xs text-muted-foreground">The estimated time (in minutes) required to prepare an order. Used to show live ETA to customers.</p>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                defaultValue={20}
                className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm font-medium text-muted-foreground">mins</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Add-ons */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Premium Value-Add Modules
          </CardTitle>
          <CardDescription>Activate premium modules to streamline your restaurant B2B operations.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          {/* Inventory */}
          <div className="p-5 rounded-xl border border-border bg-muted/10 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <PackageCheck className="h-5 w-5" />
                <span>Inventory & Supply Chain</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Raw materials ledger, automated supplier invoices, recipe breakdown, and warnings on low stock levels.
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-semibold text-amber-600">₹999 ($12) / mo</span>
              <Button 
                size="sm" 
                variant={inventory ? "default" : "outline"}
                onClick={() => toggleAddon("Inventory & Suppliers", inventory, setInventory)}
              >
                {inventory ? "Active" : "Unlock Module"}
              </Button>
            </div>
          </div>

          {/* Payroll */}
          <div className="p-5 rounded-xl border border-border bg-muted/10 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <UserCheck className="h-5 w-5" />
                <span>Payroll & HR Engine</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clock-in/out attendance rosters, paid leave approvals, automated staff monthly salary runs and payslips.
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-semibold text-amber-600">₹1,499 ($18) / mo</span>
              <Button 
                size="sm" 
                variant={payroll ? "default" : "outline"}
                onClick={() => toggleAddon("Payroll & HR", payroll, setPayroll)}
              >
                {payroll ? "Active" : "Unlock Module"}
              </Button>
            </div>
          </div>

          {/* CRM & Loyalty */}
          <div className="p-5 rounded-xl border border-border bg-muted/10 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Smartphone className="h-5 w-5" />
                <span>CRM & Loyalty Campaigns</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Loyalty points engine, pre-paid customer digital wallet ledger, and target SMS broadcast campaigns.
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-semibold text-amber-600">₹999 ($12) / mo</span>
              <Button 
                size="sm" 
                variant={crm ? "default" : "outline"}
                onClick={() => toggleAddon("CRM & Loyalty", crm, setCrm)}
              >
                {crm ? "Active" : "Unlock Module"}
              </Button>
            </div>
          </div>

          {/* AI kitchen intelligence */}
          <div className="p-5 rounded-xl border border-border bg-muted/10 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>AI Forecasting & Intelligence</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Daily sales demand prediction models, combo deal recommendations, and ingredient consumption projections.
              </p>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-semibold text-amber-600">₹1,999 ($25) / mo</span>
              <Button 
                size="sm" 
                variant={ai ? "default" : "outline"}
                onClick={() => toggleAddon("AI Forecasting", ai, setAi)}
              >
                {ai ? "Active" : "Unlock Module"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button size="lg" className="px-8 font-semibold" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving Settings..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
