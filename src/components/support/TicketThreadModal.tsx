import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupport } from '@/hooks/api/useSupport';
import { useAuthStore } from '@/store/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Send, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TicketThreadModalProps {
  ticketId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isPlatform?: boolean;
}

export default function TicketThreadModal({ ticketId, isOpen, onClose, isPlatform = false }: TicketThreadModalProps) {
  const { user } = useAuthStore();
  const { useTicketDetails, useAddMessage, useUpdateTicketStatus } = useSupport();
  
  const { data: ticket, isLoading } = useTicketDetails(ticketId || '', isPlatform);
  const { mutate: addMessage, isPending: isSending } = useAddMessage();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTicketStatus();

  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages when data loads
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !ticketId) return;
    
    addMessage(
      { ticketId, message },
      {
        onSuccess: () => {
          setMessage('');
        }
      }
    );
  };

  const handleStatusChange = (newStatus: string) => {
    if (!ticketId) return;
    updateStatus({ ticketId, status: newStatus });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center h-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : ticket ? (
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {ticket.subject}
                </DialogTitle>
                <DialogDescription className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    #{ticket.id.split('-')[0]}
                  </span>
                  <span>•</span>
                  <span>{ticket.category.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className={`text-xs font-bold ${ticket.priority === 'URGENT' ? 'text-destructive' : 'text-amber-500'}`}>
                    {ticket.priority} PRIORITY
                  </span>
                </DialogDescription>
              </div>

              <div className="flex flex-col items-end gap-2">
                {isPlatform ? (
                  <Select value={ticket.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                    <SelectTrigger className="w-[160px] h-8 text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="WAITING_ON_CUSTOMER">Waiting on Customer</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className={`
                    ${ticket.status === 'OPEN' ? 'bg-info/10 text-info border-info/20' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      'bg-muted text-muted-foreground'
                    }
                  `}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">Ticket not found</div>
          )}
        </div>

        {/* Messages List */}
        <div className="flex-1 bg-muted/20 p-6 overflow-y-auto" ref={scrollRef}>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : ticket ? (
            <div className="space-y-6 flex flex-col justify-end min-h-full">
              {/* Original Description as the first message */}
              <div className="flex flex-col items-start gap-1 max-w-[85%]">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-sm font-semibold text-foreground">
                    {ticket.createdBy?.name || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border text-sm text-foreground shadow-sm whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>

              {/* Thread Messages */}
              {/* Reverse to show chronological order if backend returns DESC */}
              {[...(ticket.messages || [])].reverse().map((msg: any) => {
                const isMe = msg.senderId === user?.id;
                const isStaff = msg.sender?.role === 'SUPER_ADMIN' || msg.sender?.role === 'PLATFORM_ADMIN';
                
                return (
                  <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                      {!isMe && isStaff && <ShieldAlert className="h-3.5 w-3.5 text-primary" />}
                      <span className="text-sm font-semibold text-foreground">
                        {isMe ? 'You' : msg.sender?.name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div className={`p-4 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                      isMe 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : isStaff 
                          ? 'bg-card border border-primary/20 rounded-tl-sm'
                          : 'bg-card border border-border rounded-tl-sm text-foreground'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSendMessage} className="relative">
            <Textarea 
              placeholder="Type your message here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none pr-14"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isSending || !message.trim()}
              className="absolute bottom-3 right-3 h-10 w-10 rounded-full"
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <div className="text-[10px] text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift + Enter for new line. Image attachments are coming soon!
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
