import { useState } from 'react';
import { LifeBuoy, Filter, Search, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Platform Support Inbox
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-900">
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

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-900 dark:text-white">{filteredTickets?.length || 0}</span> tickets matching criteria
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-zinc-800">
          {isLoading ? (
            <div className="p-8 text-center animate-pulse text-slate-500">Loading tickets...</div>
          ) : filteredTickets?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <LifeBuoy className="h-12 w-12 text-slate-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Tickets Found</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
                No tickets match your current search and filter criteria.
              </p>
            </div>
          ) : (
            filteredTickets?.map((ticket: any) => (
              <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer flex justify-between items-center group">
                <div className="flex gap-4 items-start">
                  <div className="mt-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      ticket.status === 'OPEN' ? 'bg-blue-500' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-500' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-500' :
                      'bg-slate-300 dark:bg-zinc-700'
                    }`} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">#{ticket.id.split('-')[0].toUpperCase()}</span>
                      <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {ticket.subject}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                        {ticket.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-1 max-w-2xl">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-zinc-500">
                      <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-zinc-300">
                        {ticket.tenant?.name || 'Unknown Tenant'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" /> {ticket.createdBy?.name || 'User'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    ticket.priority === 'URGENT' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
                    ticket.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20' :
                    ticket.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                    'bg-slate-50 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700'
                  }`}>
                    {ticket.priority}
                  </span>
                  {ticket.assignedTo ? (
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Assigned: {ticket.assignedTo.name}</span>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-zinc-500 italic">Unassigned</span>
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
