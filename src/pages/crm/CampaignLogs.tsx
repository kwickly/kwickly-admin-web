import { Send, MessageSquare, Calendar } from "lucide-react";
import { useState } from "react";
import { useSegments, useCampaigns, useCreateCampaign } from "@/hooks/api/useCRM";
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
  const { data: segments } = useSegments();
  const { data: campaigns, isLoading: isCampsLoading } = useCampaigns();
  const createCampaignMutation = useCreateCampaign();

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Campaign Logs & Dispatcher
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Broadcasting dynamic messages to selected customer segment.
          </p>
        </div>
        <Dialog open={campOpen} onOpenChange={setCampOpen}>
          {/* @ts-ignore */}
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-zinc-100">Dispatch Marketing Campaign</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-zinc-400">
                Broadcasting dynamic messages to selected customer segment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="campTitle" className="text-slate-700 dark:text-zinc-300">Campaign Title</Label>
                <Input
                  id="campTitle"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="e.g. Free Dessert Weekend Promo"
                  className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="segment" className="text-slate-700 dark:text-zinc-300">Target Segment</Label>
                <Select value={targetSegmentId} onValueChange={(val: any) => setTargetSegmentId(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue placeholder="Select a segment" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    {segments?.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name} ({s.customerCount} users)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="channel" className="text-slate-700 dark:text-zinc-300">Marketing Channel</Label>
                <Select value={channel} onValueChange={(val: any) => setChannel(val)}>
                  <SelectTrigger className="bg-transparent border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                    <SelectItem value="whatsapp">WhatsApp Business API</SelectItem>
                    <SelectItem value="push">Mobile App Push Notification</SelectItem>
                    <SelectItem value="email">Email Broadcast</SelectItem>
                    <SelectItem value="sms">Transactional SMS Gateway</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message" className="text-slate-700 dark:text-zinc-300">Message Content</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="e.g. Hey! We haven't seen you this week. Here is a coupon for 15% off your next meal scan!"
                  className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={createCampaignMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> {createCampaignMutation.isPending ? 'Sending...' : 'Broadcast Campaign'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isCampsLoading ? (
        <div className="text-center py-6 text-slate-500">Loading campaigns...</div>
      ) : !campaigns || campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-500">
          No campaigns dispatched yet.
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
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
                  <TableCell className="font-medium text-slate-900 dark:text-zinc-100">{camp.title}</TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 capitalize flex items-center gap-1.5 pt-4">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                    {camp.channel}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 font-mono text-xs">{camp.sentCount} recipients</TableCell>
                  <TableCell>
                    <Badge variant={camp.status === 'SENT' ? 'outline' : 'secondary'} className={camp.status === 'SENT' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10' : ''}>
                      {camp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-zinc-400 flex items-center gap-1 text-xs pt-4">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(camp.sentAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
