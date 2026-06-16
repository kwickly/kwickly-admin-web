import { CreditCard, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useSubscriptionPlans, useCreateSubscriptionPlan } from "@/hooks/api/useSubscriptions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Subscriptions() {
  const { data: plans, isLoading } = useSubscriptionPlans('default');
  const { mutate: createPlan, isPending } = useCreateSubscriptionPlan();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  const [totalMeals, setTotalMeals] = useState('30');
  const [mealType, setMealType] = useState<'lunch' | 'dinner' | 'both'>('both');
  const [planType, setPlanType] = useState<'meal_count' | 'monthly' | 'custom'>('meal_count');
  const [carryForward, setCarryForward] = useState(false);
  const [allowHoliday, setAllowHoliday] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !validityDays || !totalMeals) return;

    createPlan(
      {
        name,
        description,
        price,
        validityDays: parseInt(validityDays) || 30,
        totalMeals: parseInt(totalMeals) || 30,
        mealType,
        planType,
        carryForward,
        allowHoliday,
        branchId: undefined, // global for tenant
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName('');
          setDescription('');
          setPrice('');
          setValidityDays('30');
          setTotalMeals('30');
          setMealType('both');
          setPlanType('meal_count');
          setCarryForward(false);
          setAllowHoliday(false);
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Subscription Plans
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Configure meal subscription plans and pricing packages for your customers.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-zinc-100">Create Subscription Plan</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-zinc-400">
                Define a new subscription package for meal delivery/pickup.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">Plan Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 30-Day Premium Both Meals"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-slate-700 dark:text-zinc-300">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Perfect for corporate employees"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-slate-700 dark:text-zinc-300">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 4500"
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="validity" className="text-slate-700 dark:text-zinc-300">Validity (Days)</Label>
                  <Input
                    id="validity"
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    placeholder="30"
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="meals" className="text-slate-700 dark:text-zinc-300">Total Meals</Label>
                  <Input
                    id="meals"
                    type="number"
                    value={totalMeals}
                    onChange={(e) => setTotalMeals(e.target.value)}
                    placeholder="30"
                    className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mealType" className="text-slate-700 dark:text-zinc-300">Meal Type</Label>
                  <Select value={mealType} onValueChange={(val: any) => setMealType(val)}>
                    <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                      <SelectValue placeholder="Select meal timing" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                      <SelectItem value="lunch">Lunch Only</SelectItem>
                      <SelectItem value="dinner">Dinner Only</SelectItem>
                      <SelectItem value="both">Both Lunch & Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="planType" className="text-slate-700 dark:text-zinc-300">Plan Billing Model</Label>
                <Select value={planType} onValueChange={(val: any) => setPlanType(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue placeholder="Select billing type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="meal_count">Fixed Meal Count</SelectItem>
                    <SelectItem value="monthly">Monthly Calendar Reset</SelectItem>
                    <SelectItem value="custom">Custom Timing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="carryForward"
                    checked={carryForward}
                    onChange={(e) => setCarryForward(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor="carryForward" className="text-sm font-normal text-slate-600 dark:text-zinc-300 cursor-pointer">
                    Enable Carry Forward (unused meals transfer to next subscription)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowHoliday"
                    checked={allowHoliday}
                    onChange={(e) => setAllowHoliday(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor="allowHoliday" className="text-sm font-normal text-slate-600 dark:text-zinc-300 cursor-pointer">
                    Allow Holiday Pauses (freeze subscription on public holidays)
                  </Label>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                  {isPending ? 'Creating plan...' : 'Create Subscription Plan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">Loading subscription plans...</div>
      ) : !plans || plans.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
          <CreditCard className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No subscription plans created yet</h3>
          <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
            Subscription plans allow customers to subscribe to bulk meal plans with automated digital ID scans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col justify-between shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-zinc-100">{plan.name}</CardTitle>
                  <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 capitalize font-medium">
                    {plan.mealType}
                  </Badge>
                </div>
                {plan.description && (
                  <CardDescription className="text-slate-500 dark:text-zinc-400 mt-1.5 text-xs line-clamp-2">
                    {plan.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="py-5 space-y-4 flex-grow">
                <div className="flex items-baseline text-slate-900 dark:text-zinc-100">
                  <span className="text-3xl font-extrabold tracking-tight">₹{plan.price}</span>
                  <span className="ml-1 text-sm font-semibold text-slate-500 dark:text-zinc-400">/{plan.validityDays} days</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800 text-sm text-slate-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span><strong>{plan.totalMeals}</strong> Total Meals Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="capitalize">Model: {plan.planType.replace('_', ' ')}</span>
                  </div>
                  {plan.carryForward && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Unused meals Carry Forward</span>
                    </div>
                  )}
                  {plan.allowHoliday && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Holiday Pauses Allowed</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/10 py-3 flex justify-between items-center text-xs text-slate-400">
                <span>Created {new Date(plan.createdAt || Date.now()).toLocaleDateString()}</span>
                <Badge variant={plan.isActive ? 'outline' : 'destructive'} className="text-[10px] font-bold">
                  {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
