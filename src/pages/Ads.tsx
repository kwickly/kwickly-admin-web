import { LayoutGrid, Plus, MousePointer2, Eye } from "lucide-react";
import { useAds } from "@/hooks/api/useAds";
import { Button } from "@/components/ui/button";

export default function Ads() {
  const { ads, isLoading } = useAds();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            In-App Advertisements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage promotional banners for your customer mobile app.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads?.map((ad: any) => (
            <div key={ad.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <img src={ad.imageUrl} alt={ad.title} className="h-40 w-full object-cover" />
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">{ad.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{ad.link || 'No link'}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MousePointer2 className="h-4 w-4" />
                      <span className="text-xs">0</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full ${ad.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
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
