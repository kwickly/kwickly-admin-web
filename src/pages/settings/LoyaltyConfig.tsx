import { Icons } from '@/components/shared/icons';
import React, { useState, useEffect } from 'react';

import { toast } from 'sonner';
import { useLoyaltyConfig, useUpdateLoyaltyConfig } from '@/hooks/api/useLoyalty';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSkeleton } from "@/components/ui/loaders";

import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <PageHeader
        title="Loyalty & Wallet Config"
        description="Configure rewards multipliers and checkout points calculation rules."
        icon={Icons.Award}
      />

      <form onSubmit={handleLoyaltySave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            <Card className="border border-border bg-card shadow-sm flex flex-col flex-1">
              <CardHeader>
                <CardTitle>Tier Multipliers</CardTitle>
                <CardDescription>Set the points multiplier based on the user's tier.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                {isLoyaltyLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
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
                  </>
                )}
              </CardContent>
              <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 flex justify-end shrink-0 mt-auto">
                <Button type="submit" disabled={updateLoyaltyMutation.isPending}>
                  {updateLoyaltyMutation.isPending ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1 flex flex-col h-full">
            <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.Wallet className="h-5 w-5 text-warning" />
                  Wallet & Point Accumulation
                </CardTitle>
                <CardDescription>Rules regarding point accrual and wallet use.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                {isLoyaltyLoading ? (
                  <FormSkeleton />
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="pointsRate" className="text-foreground flex items-center gap-2.5">
                          <Icons.Percent className="h-4 w-4 text-muted-foreground" />
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

                    <div className="space-y-4 pt-2 border-t border-border mt-4 pt-4">
                      <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2.5">
                         Wallet Restrictions
                      </h3>
                      
                      <div className="flex items-center space-x-2 min-h-[44px]">
                        <input
                          type="checkbox"
                          id="walletTopUp"
                          checked={walletTopUp}
                          onChange={(e) => setWalletTopUp(e.target.checked)}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <Label htmlFor="walletTopUp" className="text-sm font-normal text-muted-foreground cursor-pointer flex-1 min-w-0 h-full flex items-center py-4">
                          Enable In-App Wallet Top-Ups via Razorpay
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 min-h-[44px]">
                        <input
                          type="checkbox"
                          id="partialDeduction"
                          checked={partialDeduction}
                          onChange={(e) => setPartialDeduction(e.target.checked)}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <Label htmlFor="partialDeduction" className="text-sm font-normal text-muted-foreground cursor-pointer flex-1 min-w-0 h-full flex items-center py-4">
                          Allow Partial Point Redemption during Checkout
                        </Label>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
