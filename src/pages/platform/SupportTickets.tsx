import { useState } from 'react';
import { LifeBuoy, Clock, MessageCircle } from "lucide-react";
import { useSupport } from '@/hooks/api/useSupport';
import { formatDistanceToNow } from 'date-fns';
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PlatformSupportTickets() {
  const { usePlatformTickets } = useSupport();
  const { data: tickets, isLoading } = usePlatformTickets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredTickets = tickets?.filter((t: any) => {
    const matchesSearch = search === "" || 
      t.subject.toLowerCase().includes(search.toLowerCase()) || 
      (t.tenant?.name && t.tenant.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-primary" />
            Platform Support Inbox
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and respond to tenant support tickets system-wide.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SearchInput 
          value={search} 
          onChange={(val) => { setSearch(val); }} 
          placeholder="Search tickets by subject or tenant..." 
          className="w-full max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'ALL')}>
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="WAITING_ON_CUSTOMER">Waiting on Customer</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredTickets?.length || 0}</span> tickets matching criteria
          </div>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center animate-pulse text-muted-foreground">Loading tickets...</div>
          ) : filteredTickets?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <LifeBuoy className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No Tickets Found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                No tickets match your current search and filter criteria.
              </p>
            </div>
          ) : (
            filteredTickets?.map((ticket: any) => (
              <div key={ticket.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex justify-between items-center group">
                <div className="flex gap-4 items-start">
                  <div className="mt-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      ticket.status === 'OPEN' ? 'bg-info' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-500' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-500' :
                      'bg-muted-foreground'
                    }`} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">#{ticket.id.split('-')[0].toUpperCase()}</span>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {ticket.subject}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-background text-muted-foreground border border-border uppercase tracking-wider">
                        {ticket.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                      <span className="flex items-center gap-1 font-medium text-foreground/70">
                        {ticket.tenant?.name || 'Unknown Tenant'}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="h-3.5 w-3.5" /> {ticket.createdBy?.name || 'User'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    ticket.priority === 'URGENT' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                    ticket.priority === 'HIGH' ? 'bg-warning/10 text-warning border border-warning/20' :
                    ticket.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                    'bg-background text-foreground border border-border'
                  }`}>
                    {ticket.priority}
                  </span>
                  {ticket.assignedTo ? (
                    <span className="text-xs text-muted-foreground">Assigned: {ticket.assignedTo.name}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground/70 italic">Unassigned</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
