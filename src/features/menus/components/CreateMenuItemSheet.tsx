import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CreateMenuItemSheet() {
  return (
    <Sheet>
      {/* @ts-ignore - Radix UI type bug with TS 5.7+ */}
      <SheetTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Menu Item</Button>
      </SheetTrigger>
      <SheetContent className="bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-slate-900 dark:text-zinc-100">Create Menu Item</SheetTitle>
          <SheetDescription className="text-slate-500 dark:text-zinc-400">
            Add a new item to your menu. You can configure categories and modifiers here.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">Item Name</Label>
            <Input id="name" placeholder="e.g. Double Cheeseburger" className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-700 dark:text-zinc-300">Price ($)</Label>
              <Input id="price" type="number" step="0.01" placeholder="0.00" className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700 dark:text-zinc-300">Category</Label>
              <Select>
                <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                  <SelectItem value="mains">Mains</SelectItem>
                  <SelectItem value="sides">Sides</SelectItem>
                  <SelectItem value="drinks">Drinks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modifiers" className="text-slate-700 dark:text-zinc-300">Modifier Groups</Label>
            <Select>
              <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                <SelectValue placeholder="Attach modifier group..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                <SelectItem value="cheese">Cheese Options (+ $0.50)</SelectItem>
                <SelectItem value="temps">Meat Temperatures</SelectItem>
                <SelectItem value="sauces">Extra Sauces</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800">
          <SheetFooter>
            {/* @ts-ignore - Radix UI type bug with TS 5.7+ */}
            <SheetClose asChild>
              <Button variant="outline" className="border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800">Cancel</Button>
            </SheetClose>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Item</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
