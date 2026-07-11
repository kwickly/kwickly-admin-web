import { useState } from 'react';
import { LifeBuoy, Plus, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchInput } from "@/components/ui/search-input";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSupport } from '@/hooks/api/useSupport';
import { formatDistanceToNow } from 'date-fns';

export default function TenantSupportTickets() {
  const { useTenantTickets, useCreateTicket } = useSupport();
  const { data: tickets, isLoading } = useTenantTickets();
  const { mutate: createTicket, isPending: isCreating } = useCreateTicket();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ subject: '', description: '', priority: 'MEDIUM', category: 'OTHER' });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredTickets = tickets?.filter((t: any) => {
    const matchesSearch = search === "" || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;
    createTicket(formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({ subject: '', description: '', priority: 'MEDIUM', category: 'OTHER' });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-primary" />
            Support Inbox
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and track support tickets with the platform team.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Ticket
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full">
          <SearchInput 
            value={search} 
            onChange={(val) => { setSearch(val); }} 
            placeholder="Search your tickets..." 
            className="w-full max-w-sm"
          />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'ALL')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="WAITING_ON_CUSTOMER">Waiting on Customer</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          <span className="font-medium text-foreground">{filteredTickets?.length || 0}</span> tickets
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
      ) : filteredTickets?.length === 0 ? (
        <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-xl bg-card/50">
          <div className="text-center">
            <LifeBuoy className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Tickets Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You haven't created any support tickets. If you need help, feel free to open one!
            </p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Ticket
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets?.map((ticket: any) => (
            <div key={ticket.id} className="p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                    {ticket.category.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-wider ${
                    ticket.status === 'OPEN' ? 'bg-info/10 text-info' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-600' :
                    ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-emerald-500/10 text-emerald-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground/70 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> Click to view thread
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-semibold ${
                  ticket.priority === 'URGENT' ? 'text-destructive' :
                  ticket.priority === 'HIGH' ? 'text-warning' :
                  ticket.priority === 'MEDIUM' ? 'text-amber-500' :
                  'text-muted-foreground'
                }`}>
                  {ticket.priority} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Open a Support Ticket</DialogTitle>
            <DialogDescription>
              We'll get back to you as soon as possible. Please provide as much detail as you can.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input 
                placeholder="e.g. Can't access the staff page" 
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v || '' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUG">Bug Report</SelectItem>
                    <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
                    <SelectItem value="BILLING">Billing</SelectItem>
                    <SelectItem value="ONBOARDING">Onboarding</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v || '' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Please describe the issue..." 
                className="min-h-[120px]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
