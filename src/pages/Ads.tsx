import { LayoutGrid, Plus, MousePointer2, Eye } from "lucide-react";
import { useAds } from "@/hooks/api/useAds";
import { GridCardSkeleton } from "@/components/ui/loaders";

export default function Ads() {
  const { ads, isLoading } = useAds();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            In-App Advertisements
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage promotional banners for your customer mobile app.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Create Ad
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads?.map((ad: any) => (
            <div key={ad.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <img src={ad.imageUrl} alt={ad.title} className="h-40 w-100 object-cover" />
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{ad.title}</h3>
                  <p className="text-xs text-slate-500 truncate">{ad.link || 'No link'}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MousePointer2 className="h-4 w-4" />
                      <span className="text-xs">0</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full ${ad.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                    {ad.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
