import { CreditCard, Plus, Check, Edit2, Trash2, Calendar, ShieldAlert } from "lucide-react";
import { useState } from "react";
import {
  useSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  type SubscriptionPlan
} from "@/hooks/api/useSubscriptions";
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
import { useBranchStore } from "@/store/useBranch";
import { Can } from "@/components/shared/Can";

export default function Subscriptions() {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId && selectedBranchId !== 'default' ? selectedBranchId : undefined;
  
  // Load plans, including inactive ones for management
  const { data: plans, isLoading } = useSubscriptionPlans(branchId, true);
  
  const { mutate: createPlan, isPending: isCreating } = useCreateSubscriptionPlan();
  const { mutate: updatePlan, isPending: isUpdating } = useUpdateSubscriptionPlan();
  const { mutate: deletePlan, isPending: isDeleting } = useDeleteSubscriptionPlan();

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  const [totalMeals, setTotalMeals] = useState('30');
  const [mealType, setMealType] = useState<'lunch' | 'dinner' | 'both'>('both');
  const [planType, setPlanType] = useState<'meal_count' | 'monthly' | 'custom'>('meal_count');
  const [carryForward, setCarryForward] = useState(false);
  const [allowHoliday, setAllowHoliday] = useState(false);

  // Edit/Delete Modal State
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editValidityDays, setEditValidityDays] = useState('');
  const [editTotalMeals, setEditTotalMeals] = useState('');
  const [editMealType, setEditMealType] = useState<'lunch' | 'dinner' | 'both'>('both');
  const [editPlanType, setEditPlanType] = useState<'meal_count' | 'monthly' | 'custom'>('meal_count');
  const [editCarryForward, setEditCarryForward] = useState(false);
  const [editAllowHoliday, setEditAllowHoliday] = useState(false);
  const [editIsActive, setEditIsActive] = useState('true');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !validityDays || !totalMeals) return;

    createPlan(
      {
        name,
        description: description || undefined,
        price,
        validityDays: parseInt(validityDays) || 30,
        totalMeals: parseInt(totalMeals) || 30,
        mealType,
        planType,
        carryForward,
        allowHoliday,
        branchId, // bind to current branch context
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
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

  const handleEditClick = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditDescription(plan.description || '');
    setEditPrice(plan.price);
    setEditValidityDays(String(plan.validityDays));
    setEditTotalMeals(String(plan.totalMeals));
    setEditMealType(plan.mealType);
    setEditPlanType(plan.planType);
    setEditCarryForward(plan.carryForward);
    setEditAllowHoliday(plan.allowHoliday);
    setEditIsActive(plan.isActive ? 'true' : 'false');
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    updatePlan(
      {
        id: editingPlan.id,
        payload: {
          name: editName,
          description: editDescription || null,
          price: editPrice,
          validityDays: parseInt(editValidityDays) || 30,
          totalMeals: parseInt(editTotalMeals) || 30,
          mealType: editMealType,
          planType: editPlanType,
          carryForward: editCarryForward,
          allowHoliday: editAllowHoliday,
          isActive: editIsActive === 'true',
        },
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setEditingPlan(null);
        },
      }
    );
  };

  const handleDeleteSubmit = () => {
    if (!editingPlan) return;
    deletePlan(editingPlan.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setEditOpen(false);
        setEditingPlan(null);
      },
    });
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

        <Can perform="subscriptions:manage">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
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
              <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
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
                  <Button type="submit" disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                    {isCreating ? 'Creating plan...' : 'Create Subscription Plan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Can>
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
            <Card key={plan.id} className={`bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col justify-between shadow-sm relative ${!plan.isActive ? 'opacity-70 border-dashed' : ''}`}>
              {!plan.isActive && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  <ShieldAlert className="h-3 w-3" /> Inactive
                </div>
              )}
              <CardHeader className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 pb-4 pr-16">
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
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Created {new Date(plan.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <Can perform="subscriptions:manage">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditClick(plan)}
                      className="h-7 w-7 p-0 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Can>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Plan Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">Edit Subscription Plan</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Modify subscription pricing, meals, or suspend/delete this plan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-slate-700 dark:text-zinc-300">Plan Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="text-slate-700 dark:text-zinc-300">Description</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price" className="text-slate-700 dark:text-zinc-300">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-validity" className="text-slate-700 dark:text-zinc-300">Validity (Days)</Label>
                <Input
                  id="edit-validity"
                  type="number"
                  value={editValidityDays}
                  onChange={(e) => setEditValidityDays(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-meals" className="text-slate-700 dark:text-zinc-300">Total Meals</Label>
                <Input
                  id="edit-meals"
                  type="number"
                  value={editTotalMeals}
                  onChange={(e) => setEditTotalMeals(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-mealType" className="text-slate-700 dark:text-zinc-300">Meal Type</Label>
                <Select value={editMealType} onValueChange={(val: any) => setEditMealType(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="lunch">Lunch Only</SelectItem>
                    <SelectItem value="dinner">Dinner Only</SelectItem>
                    <SelectItem value="both">Both Lunch & Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-planType" className="text-slate-700 dark:text-zinc-300">Plan Model</Label>
                <Select value={editPlanType} onValueChange={(val: any) => setEditPlanType(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="meal_count">Fixed Meal Count</SelectItem>
                    <SelectItem value="monthly">Monthly Calendar Reset</SelectItem>
                    <SelectItem value="custom">Custom Timing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-isActive" className="text-slate-700 dark:text-zinc-300">Purchase Status</Label>
                <Select value={editIsActive} onValueChange={(val: any) => setEditIsActive(val || 'true')}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="true">Active (For Purchase)</SelectItem>
                    <SelectItem value="false">Inactive (Suspended)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-carryForward"
                  checked={editCarryForward}
                  onChange={(e) => setEditCarryForward(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="edit-carryForward" className="text-sm font-normal text-slate-600 dark:text-zinc-300 cursor-pointer">
                  Enable Carry Forward
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-allowHoliday"
                  checked={editAllowHoliday}
                  onChange={(e) => setEditAllowHoliday(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="edit-allowHoliday" className="text-sm font-normal text-slate-600 dark:text-zinc-300 cursor-pointer">
                  Allow Holiday Pauses
                </Label>
              </div>
            </div>

            <DialogFooter className="pt-4 flex justify-between items-center sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" /> Delete Plan
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-zinc-100">Delete Subscription Plan?</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400">
              Are you sure you want to delete this subscription plan? Existing customer subscriptions will remain valid, but no new purchases will be allowed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
