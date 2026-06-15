export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Overview</h1>
        <p className="text-slate-500 dark:text-zinc-400">Here's what's happening at your restaurant today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Stat Cards */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">Today's Revenue</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100">$4,231.50</p>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12.5% from yesterday</span>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">Active Orders</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100">24</p>
          <span className="text-sm text-slate-500 dark:text-zinc-400">8 in kitchen, 16 preparing</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">Staff on Duty</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-zinc-100">12</p>
          <span className="text-sm text-slate-500 dark:text-zinc-400">Next shift change in 2h</span>
        </div>
      </div>
    </div>
  );
}
