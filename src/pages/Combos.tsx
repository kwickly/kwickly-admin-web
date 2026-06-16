import { Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Combos() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Blocks className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Combo Meals
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Group existing menu items into meal combos with custom pricing.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Combo</Button>
      </div>

      <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
        <Blocks className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100">No combos created yet</h3>
        <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto">
          Combos allow you to package a main item, sides, and drinks together at a specific price point.
        </p>
        <Button variant="outline" className="mt-6 border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800">
          Build First Combo
        </Button>
      </div>
    </div>
  );
}
