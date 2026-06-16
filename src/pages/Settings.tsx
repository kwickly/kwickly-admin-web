import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Store, Phone, MapPin, Award, Wallet, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { useBranches, useUpdateBranch } from '@/hooks/api/useSettings';
import { useLoyaltyConfig, useUpdateLoyaltyConfig } from '@/hooks/api/useLoyalty';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  // Branch State
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

  // Loyalty State
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          System Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Configure your restaurant branch profile, loyalty points, and digital wallet systems.
        </p>
      </div>

      <Tabs defaultValue="branch" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-zinc-900/50 p-1 border border-slate-200 dark:border-zinc-800 rounded-lg mb-6">
          <TabsTrigger value="branch" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Branch Profile
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-800 data-[state=active]:text-indigo-600 data-[state=active]:dark:text-indigo-400 data-[state=active]:shadow-sm">
            Loyalty & Wallet Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branch" className="mt-0 outline-none">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Branch Profile</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Update your public-facing restaurant information.
              </p>
            </div>

            <form onSubmit={handleBranchSave} className="p-6 space-y-6">
              {isBranchLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
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
                        className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
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
                        className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
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
                        className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                        placeholder="Enter full address"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-zinc-800">
                    <button
                      type="submit"
                      disabled={isBranchSaving || !currentBranch}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Save className="h-4 w-4" />
                      {isBranchSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="mt-0 outline-none">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Loyalty Program Settings
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Configure rewards multipliers and checkout points calculation rules.
              </p>
            </div>

            <form onSubmit={handleLoyaltySave} className="p-6 space-y-6">
              {isLoyaltyLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Tier Multipliers</h3>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="bronze" className="text-slate-700 dark:text-zinc-300">Bronze Tier Multiplier</Label>
                        <Input
                          id="bronze"
                          type="number"
                          step="0.1"
                          value={bronze}
                          onChange={(e) => setBronze(e.target.value)}
                          className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="silver" className="text-slate-700 dark:text-zinc-300">Silver Tier Multiplier</Label>
                        <Input
                          id="silver"
                          type="number"
                          step="0.1"
                          value={silver}
                          onChange={(e) => setSilver(e.target.value)}
                          className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="gold" className="text-slate-700 dark:text-zinc-300">Gold Tier Multiplier</Label>
                        <Input
                          id="gold"
                          type="number"
                          step="0.1"
                          value={gold}
                          onChange={(e) => setGold(e.target.value)}
                          className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Wallet & Point Accumulation</h3>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="pointsRate" className="text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <Percent className="h-4 w-4 text-slate-400" />
                            Loyalty Points Earned Per ₹1 Spent
                          </Label>
                          <Input
                            id="pointsRate"
                            type="number"
                            step="0.01"
                            value={pointsPerRupee}
                            onChange={(e) => setPointsPerRupee(e.target.value)}
                            className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <Wallet className="h-4 w-4 text-slate-400" /> Wallet Restrictions
                        </h3>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="walletTopUp"
                            checked={walletTopUp}
                            onChange={(e) => setWalletTopUp(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label htmlFor="walletTopUp" className="text-sm font-normal text-slate-600 dark:text-zinc-300 cursor-pointer">
                            Enable In-App Wallet Top-Ups via Razorpay
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="partialDeduction"
                            checked={partialDeduction}
                            onChange={(e) => setPartialDeduction(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label htmlFor="partialDeduction" className="text-sm font-normal text-slate-600 dark:text-zinc-300 cursor-pointer">
                            Allow Partial Point Redemption during Checkout
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-zinc-800">
                    <button
                      type="submit"
                      disabled={updateLoyaltyMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Save className="h-4 w-4" />
                      {updateLoyaltyMutation.isPending ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
