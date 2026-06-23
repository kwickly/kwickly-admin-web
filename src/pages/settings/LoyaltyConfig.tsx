import React, { useState, useEffect } from 'react';
import { Award, Wallet, Percent, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useLoyaltyConfig, useUpdateLoyaltyConfig } from '@/hooks/api/useLoyalty';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSkeleton } from "@/components/ui/loaders";

export default function LoyaltyConfig() {
  const { data: loyaltyData, isLoading: isLoyaltyLoading } = useLoyaltyConfig();
  const updateLoyaltyMutation = useUpdateLoyaltyConfig();

  const [bronze, setBronze] = useState('1.0');
  const [silver, setSilver] = useState('1.2');
  const [gold, setGold] = useState('1.5');
  const [pointsPerRupee, setPointsPerRupee] = useState('0.1');
  const [walletTopUp, setWalletTopUp] = useState(true);
  const [partialDeduction, setPartialDeduction] = useState(true);

  useEffect(() => {
    if (loyaltyData) {
      setBronze(loyaltyData.bronzeMultiplier);
      setSilver(loyaltyData.silverMultiplier);
      setGold(loyaltyData.goldMultiplier);
      setPointsPerRupee(loyaltyData.pointsPerRupee);
      setWalletTopUp(loyaltyData.walletTopUpEnabled);
      setPartialDeduction(loyaltyData.partialDeductionAllowed);
    }
  }, [loyaltyData]);

  const handleLoyaltySave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoyaltyMutation.mutate(
      {
        bronzeMultiplier: bronze,
        silverMultiplier: silver,
        goldMultiplier: gold,
        pointsPerRupee,
        walletTopUpEnabled: walletTopUp,
        partialDeductionAllowed: partialDeduction
      },
      {
        onSuccess: () => {
          toast.success('Loyalty settings saved successfully');
        }
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Loyalty & Wallet Config
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure rewards multipliers and checkout points calculation rules.
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        <form onSubmit={handleLoyaltySave} className="p-6 space-y-6">
          {isLoyaltyLoading ? (
            <FormSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Tier Multipliers</h3>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bronze" className="text-foreground">Bronze Tier Multiplier</Label>
                    <Input
                      id="bronze"
                      type="number"
                      step="0.1"
                      value={bronze}
                      onChange={(e) => setBronze(e.target.value)}
                      className="bg-transparent border-border text-foreground"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="silver" className="text-foreground">Silver Tier Multiplier</Label>
                    <Input
                      id="silver"
                      type="number"
                      step="0.1"
                      value={silver}
                      onChange={(e) => setSilver(e.target.value)}
                      className="bg-transparent border-border text-foreground"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="gold" className="text-foreground">Gold Tier Multiplier</Label>
                    <Input
                      id="gold"
                      type="number"
                      step="0.1"
                      value={gold}
                      onChange={(e) => setGold(e.target.value)}
                      className="bg-transparent border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Wallet & Point Accumulation</h3>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="pointsRate" className="text-foreground flex items-center gap-1.5">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        Loyalty Points Earned Per ₹1 Spent
                      </Label>
                      <Input
                        id="pointsRate"
                        type="number"
                        step="0.01"
                        value={pointsPerRupee}
                        onChange={(e) => setPointsPerRupee(e.target.value)}
                        className="bg-transparent border-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                      <Wallet className="h-4 w-4 text-muted-foreground" /> Wallet Restrictions
                    </h3>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="walletTopUp"
                        checked={walletTopUp}
                        onChange={(e) => setWalletTopUp(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <Label htmlFor="walletTopUp" className="text-sm font-normal text-muted-foreground cursor-pointer">
                        Enable In-App Wallet Top-Ups via Razorpay
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="partialDeduction"
                        checked={partialDeduction}
                        onChange={(e) => setPartialDeduction(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <Label htmlFor="partialDeduction" className="text-sm font-normal text-muted-foreground cursor-pointer">
                        Allow Partial Point Redemption during Checkout
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={updateLoyaltyMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  {updateLoyaltyMutation.isPending ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
