import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCreateAddon } from "@/hooks/api/useMenus"

export default function CreateModifierDialog() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [open, setOpen] = useState(false)

  const { mutate: createAddon, isPending } = useCreateAddon()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price) return

    createAddon(
      { name, price },
      {
        onSuccess: () => {
          setOpen(false)
          setName('')
          setPrice('')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-ignore */}
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Modifier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-zinc-100">Create Modifier / Add-on</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-zinc-400">
            Create a global modifier that can be added to orders (e.g. Extra Cheese, Extra Sauce).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300">Modifier Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Extra Cheese"
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-slate-700 dark:text-zinc-300">Additional Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 20"
                className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
              {isPending ? 'Creating...' : 'Create Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
