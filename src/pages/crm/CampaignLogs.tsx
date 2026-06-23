import { Send, MessageSquare, Calendar } from "lucide-react";
import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { useSegments, useCampaigns, useCreateCampaign } from "@/hooks/api/useCRM";
import { TableSkeleton } from "@/components/ui/loaders";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CampaignLogs() {
  const { data: segmentsResponse } = useSegments(1, 100); // Fetch all segments for the dropdown
  const segments = segmentsResponse?.data || [];
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: response, isLoading: isCampsLoading } = useCampaigns(page, 50, search);
  const createCampaignMutation = useCreateCampaign();

  const campaigns = response?.data || [];
  const meta = response?.meta;

  // Create Campaign State
  const [campOpen, setCampOpen] = useState(false);
  const [campTitle, setCampTitle] = useState('');
  const [targetSegmentId, setTargetSegmentId] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [message, setMessage] = useState('');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle || !targetSegmentId || !message) return;

    createCampaignMutation.mutate(
      { title: campTitle, segmentId: targetSegmentId, channel, message },
      {
        onSuccess: () => {
          toast.success("Campaign dispatched successfully");
          setCampOpen(false);
          setCampTitle('');
          setTargetSegmentId('');
          setMessage('');
        }
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            Campaign Logs & Dispatcher
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Broadcasting dynamic messages to selected customer segment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); setPage(1); }} 
            placeholder="Search campaigns..." 
            className="w-64"
          />
          <Dialog open={campOpen} onOpenChange={setCampOpen}>
            {/* @ts-ignore */}
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Send Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] bg-card border border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Dispatch Marketing Campaign</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Broadcasting dynamic messages to selected customer segment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="campTitle" className="text-foreground">Campaign Title</Label>
                <Input
                  id="campTitle"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="e.g. Free Dessert Weekend Promo"
                  className="bg-transparent"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="segment" className="text-foreground">Target Segment</Label>
                <Select value={targetSegmentId} onValueChange={(val: any) => setTargetSegmentId(val)}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {segments?.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.customerCount} users)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="channel" className="text-foreground">Marketing Channel</Label>
                <Select value={channel} onValueChange={(val: any) => setChannel(val)}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="whatsapp">WhatsApp Business API</SelectItem>
                    <SelectItem value="push">Mobile App Push Notification</SelectItem>
                    <SelectItem value="email">Email Broadcast</SelectItem>
                    <SelectItem value="sms">Transactional SMS Gateway</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message" className="text-foreground">Message Content</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="e.g. Hey! We haven't seen you this week. Here is a coupon for 15% off your next meal scan!"
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={createCampaignMutation.isPending} className="w-full flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> {createCampaignMutation.isPending ? 'Sending...' : 'Broadcast Campaign'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {isCampsLoading ? (
        <TableSkeleton />
      ) : !campaigns || campaigns.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl text-muted-foreground">
          No campaigns dispatched yet.
        </div>
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Campaign Title</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((camp) => (
                <TableRow key={camp.id}>
                  <TableCell className="font-medium text-foreground">{camp.title}</TableCell>
                  <TableCell className="text-muted-foreground capitalize flex items-center gap-1.5 pt-4">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {camp.channel}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{camp.sentCount} recipients</TableCell>
                  <TableCell>
                    <Badge variant={camp.status === 'SENT' ? 'outline' : 'secondary'} className={camp.status === 'SENT' ? 'border-emerald-500/20 text-emerald-600 bg-emerald-500/10' : ''}>
                      {camp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground flex items-center gap-1 text-xs pt-4">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {new Date(camp.sentAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {meta && (
            <PaginationControls 
              page={meta.page} 
              totalPages={meta.totalPages} 
              onPageChange={setPage} 
            />
          )}
        </div>
      )}
    </div>
  );
}
