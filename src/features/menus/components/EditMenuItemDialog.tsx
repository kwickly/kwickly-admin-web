import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUpdateMenuItem, useMenuCategories, type MenuItem } from "@/hooks/api/useMenus"
import { useBranchStore } from "@/store/useBranch"

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  status: z.enum(["AVAILABLE", "OUT_OF_STOCK", "HIDDEN"]),
  
  // Dietary
  isVeg: z.boolean(),
  isJain: z.boolean(),
  isGlutenFree: z.boolean(),
  spiceLevel: z.coerce.number().min(0).max(3),

  // Badges
  isBestseller: z.boolean(),
  isChefSpecial: z.boolean(),
  isNew: z.boolean(),
  isLimitedEdition: z.boolean(),
  isHealthyChoice: z.boolean(),

  // Nutrition
  calories: z.coerce.number().optional(),
  servingSize: z.string().optional(),
  protein: z.string().optional(),
  carbs: z.string().optional(),
  fat: z.string().optional(),
})

type MenuItemFormValues = z.infer<typeof menuItemSchema>

interface EditMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
}

export default function EditMenuItemDialog({ open, onOpenChange, item }: EditMenuItemDialogProps) {
  const { selectedBranchId } = useBranchStore();
  const branchId = selectedBranchId || 'default';

  const { data: categories } = useMenuCategories(branchId)
  const { mutate: updateItem, isPending } = useUpdateMenuItem()

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema) as any,
    defaultValues: {
      name: "",
      price: "",
      categoryId: "",
      description: "",
      status: "AVAILABLE",
      isVeg: true,
      isJain: false,
      isGlutenFree: false,
      spiceLevel: 0,
      isBestseller: false,
      isChefSpecial: false,
      isNew: false,
      isLimitedEdition: false,
      isHealthyChoice: false,
    },
  })

  useEffect(() => {
    if (item && open) {
      form.reset({
        name: item.name,
        price: item.price,
        categoryId: item.categoryId,
        description: item.description || "",
        status: item.status || "AVAILABLE",
        // @ts-ignore - The API returns these but our MenuItem type isn't fully updated yet
        isVeg: item.isVeg ?? true,
        // @ts-ignore
        isJain: item.isJain ?? false,
        // @ts-ignore
        isGlutenFree: item.isGlutenFree ?? false,
        // @ts-ignore
        spiceLevel: item.spiceLevel ?? 0,
        // @ts-ignore
        isBestseller: item.isBestseller ?? false,
        // @ts-ignore
        isChefSpecial: item.isChefSpecial ?? false,
        // @ts-ignore
        isNew: item.isNew ?? false,
        // @ts-ignore
        isLimitedEdition: item.isLimitedEdition ?? false,
        // @ts-ignore
        isHealthyChoice: item.isHealthyChoice ?? false,
        // @ts-ignore
        calories: item.calories ?? undefined,
        // @ts-ignore
        servingSize: item.servingSize ?? "",
        // @ts-ignore
        protein: item.protein ?? "",
        // @ts-ignore
        carbs: item.carbs ?? "",
        // @ts-ignore
        fat: item.fat ?? "",
      })
    }
  }, [item, open, form])

  const onSubmit = (data: MenuItemFormValues) => {
    if (!item) return;

    // Strip empty nutrition string fields if they are empty
    const payload = {
      ...data,
      calories: data.calories || undefined,
      protein: data.protein || undefined,
      carbs: data.carbs || undefined,
      fat: data.fat || undefined,
    }

    updateItem(
      {
        id: item.id,
        branchId,
        payload,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-foreground font-bold text-xl">Edit Menu Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modify menu item details, pricing, categorization, or active status.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="badges">Diet & Badges</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>
            
            {/* ── Basic Info Tab ── */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Item Name *</Label>
                <Input 
                  {...form.register("name")}
                  placeholder="e.g. Double Cheeseburger" 
                  className="h-11 bg-transparent border-border text-foreground" 
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Price (₹) *</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...form.register("price")}
                    placeholder="0.00" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Category *</Label>
                  <Controller
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-11 w-full bg-transparent border-border text-foreground">
                          <SelectValue placeholder="Select Category..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {categories?.data?.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Description</Label>
                <Textarea 
                  {...form.register("description")}
                  placeholder="A short description of the item..."
                  className="bg-transparent border-border text-foreground resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border mt-4">
                <Label className="text-foreground">Availability Status</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-full bg-transparent border-border text-foreground">
                        <SelectValue placeholder="Select Status..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                        <SelectItem value="HIDDEN">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </TabsContent>

            {/* ── Diet & Badges Tab ── */}
            <TabsContent value="badges" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Dietary Preferences</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="isVeg"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="edit_isVeg" />
                        <Label htmlFor="edit_isVeg">Vegetarian</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isJain"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="edit_isJain" />
                        <Label htmlFor="edit_isJain">Jain Friendly</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isGlutenFree"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="edit_isGlutenFree" />
                        <Label htmlFor="edit_isGlutenFree">Gluten Free</Label>
                      </div>
                    )}
                  />
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label className="text-foreground">Spice Level (0-3)</Label>
                  <Input 
                    type="number" 
                    min="0" max="3"
                    {...form.register("spiceLevel")}
                    className="h-11 bg-transparent border-border text-foreground w-32" 
                  />
                  <p className="text-xs text-muted-foreground">0 = None, 1 = Mild, 2 = Medium, 3 = Hot</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground">Marketing Badges</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="isBestseller"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="edit_isBestseller" />
                        <Label htmlFor="edit_isBestseller">Bestseller</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isChefSpecial"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="edit_isChefSpecial" />
                        <Label htmlFor="edit_isChefSpecial">Chef's Special</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isHealthyChoice"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="edit_isHealthyChoice" />
                        <Label htmlFor="edit_isHealthyChoice">Healthy Choice</Label>
                      </div>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="edit_isNew" />
                        <Label htmlFor="edit_isNew">New Arrival</Label>
                      </div>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* ── Nutrition Tab ── */}
            <TabsContent value="nutrition" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Calories (kcal)</Label>
                  <Input 
                    type="number" 
                    {...form.register("calories")}
                    placeholder="e.g. 450" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Serving Size</Label>
                  <Input 
                    {...form.register("servingSize")}
                    placeholder="e.g. 1 bowl (300g)" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-foreground">Protein (g)</Label>
                  <Input 
                    type="number" step="0.1"
                    {...form.register("protein")}
                    placeholder="e.g. 12.5" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Carbs (g)</Label>
                  <Input 
                    type="number" step="0.1"
                    {...form.register("carbs")}
                    placeholder="e.g. 45" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Fat (g)</Label>
                  <Input 
                    type="number" step="0.1"
                    {...form.register("fat")}
                    placeholder="e.g. 18" 
                    className="h-11 bg-transparent border-border text-foreground" 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-4 border-t border-border">
            <DialogFooter className="flex space-x-2 justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-11">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="h-11">
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
