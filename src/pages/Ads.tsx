import { Icons } from '@/components/shared/icons';
import { useAds } from "@/hooks/api/useAds";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import ImageDropzone from '@/components/ui/image-dropzone'
import { toast } from 'sonner'

export default function Ads() {
  const { ads, isLoading, createAd, isCreating } = useAds();
  const [open, setOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMetadata, setImageMetadata] = useState<any>(null);
  const [activeFrom, setActiveFrom] = useState('');
  const [activeUntil, setActiveUntil] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      toast.error('Please enter a title and upload an image');
      return;
    }

    try {
      await createAd({
        title,
        imageUrl,
        imageMetadata: imageMetadata || undefined,
        link: link || undefined,
        activeFrom: activeFrom || undefined,
        activeUntil: activeUntil || undefined,
      });

      toast.success('Advertisement created successfully');
      setOpen(false);
      setTitle('');
      setLink('');
      setImageUrl('');
      setImageMetadata(null);
      setActiveFrom('');
      setActiveUntil('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create advertisement');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Icons.LayoutGrid className="h-6 w-6 text-primary" />
            In-App Advertisements
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage promotional banners for your customer mobile app.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Icons.Plus className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads?.map((ad: any) => (
            <div key={ad.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <img src={ad.imageUrl} alt={ad.title} className="h-40 w-full object-cover" />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground text-sm">{ad.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{ad.link || 'No link'}</p>
                </div>
              </div>
              
              <div className="p-4 pt-2 border-t border-border/50 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icons.Eye className="h-4 w-4" />
                    <span className="text-xs">0</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icons.MousePointer2 className="h-4 w-4" />
                    <span className="text-xs">0</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full ${ad.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-muted text-muted-foreground'}`}>
                  {ad.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Promotion Banner</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new clickable banner to show in the mobile customer app.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-foreground">Ad Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 50% Off on Pizzas!"
                className="h-11 bg-transparent border-border text-foreground"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link" className="text-foreground">Redirect Link (Optional)</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /menu?category=pizza"
                className="h-11 bg-transparent border-border text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <ImageDropzone
                value={imageUrl}
                onChange={(url, meta) => {
                  setImageUrl(url);
                  setImageMetadata(meta);
                }}
                label="Ad Banner Photo *"
                aspect="banner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="activeFrom" className="text-foreground">Start Date</Label>
                <Input
                  id="activeFrom"
                  type="date"
                  value={activeFrom}
                  onChange={(e) => setActiveFrom(e.target.value)}
                  className="h-11 bg-transparent border-border text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="activeUntil" className="text-foreground">End Date</Label>
                <Input
                  id="activeUntil"
                  type="date"
                  value={activeUntil}
                  onChange={(e) => setActiveUntil(e.target.value)}
                  className="h-11 bg-transparent border-border text-foreground"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isCreating} className="h-11 w-full">
                {isCreating ? 'Creating...' : 'Create Advertisement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
