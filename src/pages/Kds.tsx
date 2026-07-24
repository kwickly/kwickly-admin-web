'use client';

import React, { useMemo, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useBranchStore } from '@/store/useBranch';
import { useActiveKOTs, useUpdateKOTStatus } from '@/hooks/api/useOrders';
import type { ActiveKOT } from '@/hooks/api/useOrders';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  
  Utensils,
  ShoppingBag,
  GripVertical,
  ArrowRightCircle,
  Package,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
// ─── Types ────────────────────────────────────────────────────────────────────

type KotStatus = 'pending' | 'preparing' | 'ready';

const STATUS_ORDER: KotStatus[] = ['pending', 'preparing', 'ready'];

const COLUMN_CONFIG: Record<KotStatus, {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  headerClass: string;
  badgeClass: string;
  emptyText: string;
  nextStatus: string | null;
  actionLabel: string;
  actionClass: string;
}> = {
  pending: {
    label: 'New Orders',
    subtitle: 'Waiting to be accepted',
    icon: <Package className="h-5 w-5 text-[var(--chart-1)]" />,
    headerClass: 'bg-[var(--chart-1)]/10',
    badgeClass: 'bg-background text-foreground',
    emptyText: 'No new orders',
    nextStatus: 'preparing',
    actionLabel: 'Start Cooking',
    actionClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  preparing: {
    label: 'In Kitchen',
    subtitle: 'Currently being prepared',
    icon: <ChefHat className="h-5 w-5 text-[var(--chart-3)]" />,
    headerClass: 'bg-[var(--chart-3)]/10',
    badgeClass: 'bg-background text-foreground',
    emptyText: 'Kitchen is clear',
    nextStatus: 'ready',
    actionLabel: 'Mark Ready',
    actionClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  ready: {
    label: 'Ready',
    subtitle: 'Waiting for pickup/service',
    icon: <CheckCircle2 className="h-5 w-5 text-[var(--chart-2)]" />,
    headerClass: 'bg-[var(--chart-2)]/10',
    badgeClass: 'bg-background text-foreground',
    emptyText: 'All served!',
    nextStatus: 'completed',
    actionLabel: 'Complete & Clear',
    actionClass: 'bg-foreground hover:bg-foreground/80 text-background',
  },
};

// ─── Wait time helpers ─────────────────────────────────────────────────────────

function getWaitMinutes(createdAt: string) {
  return (Date.now() - new Date(createdAt).getTime()) / 60000;
}

function WaitBadge({ createdAt }: { createdAt: string }) {
  const mins = getWaitMinutes(createdAt);
  const isUrgent = mins > 20;
  const isWarning = mins > 10;
  const label = formatDistanceToNow(new Date(createdAt), { addSuffix: false });

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full',
        isUrgent
          ? 'bg-destructive/10 text-destructive animate-pulse'
          : isWarning
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── KOT Ticket Card ─────────────────────────────────────────────────────────

interface TicketCardProps {
  kot: ActiveKOT;
  isDragging?: boolean;
  onAction?: (kotId: string, nextStatus: string) => void;
  isPending?: boolean;
}

function TicketCard({ kot, isDragging = false, onAction, isPending }: TicketCardProps) {
  const config = COLUMN_CONFIG[kot.status as KotStatus];
  if (!config) return null;

  const items: { name: string; quantity: number, fulfillmentMode?: string }[] = Array.isArray(kot.items)
    ? kot.items
    : [];

  const isUrgent = getWaitMinutes(kot.createdAt) > 20;

  return (
    <div
      className={cn(
        'group rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-150 select-none p-1',
        isDragging
          ? 'opacity-40 scale-95'
          : 'hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing',
        isUrgent && 'ring-1 ring-destructive/30'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 pb-2">
        <div className="flex items-start gap-2 min-w-0">
          {/* Drag Handle */}
          <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0 group-hover:text-muted-foreground transition-colors" />
          <div className="min-w-0">
            {/* Order ID + Table */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-bold text-base text-foreground leading-none">
                #{kot.orderId?.slice(-4).toUpperCase() ?? kot.id.slice(-4).toUpperCase()}
              </span>
              {kot.tableNumber && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-foreground/10 text-foreground uppercase tracking-wider">
                  T{kot.tableNumber}
                </span>
              )}
              {kot.kotRound && kot.kotRound > 1 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/20 text-primary uppercase tracking-wider">
                  Round {kot.kotRound}
                </span>
              )}
              {/* Mode badge */}
              <span className="text-muted-foreground/60">
                {kot.orderMode === 'dine_in' ? (
                  <Utensils className="h-3.5 w-3.5" />
                ) : kot.orderMode === 'takeaway' ? (
                  <ShoppingBag className="h-3.5 w-3.5" />
                ) : null}
              </span>
            </div>
          </div>
        </div>
        <WaitBadge createdAt={kot.createdAt} />
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-dashed border-border" />

      {/* Items list — dense, no images */}
      <div className="px-3 py-2 space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm leading-tight">
            <span className="shrink-0 w-6 h-6 rounded-md bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center">
              {item.quantity}
            </span>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-medium text-foreground truncate">{item.name}</span>
              {item.fulfillmentMode === 'takeaway' && (
                <span className="w-fit text-[10px] font-bold px-1.5 py-0.5 mt-0.5 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 uppercase tracking-wide">
                  To-Go
                </span>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No items</p>
        )}
      </div>

      {/* Action Button */}
      {config.nextStatus && onAction && (
        <div className="px-3 pb-3 pt-1">
          <button
            onClick={() => onAction(kot.id, config.nextStatus!)}
            disabled={isPending}
            className={cn(
              'w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-lg transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              config.actionClass
            )}
          >
            <ArrowRightCircle className="h-3.5 w-3.5" />
            {config.actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Draggable Wrapper ────────────────────────────────────────────────────────

function DraggableTicket({ kot, onAction, isPending }: {
  kot: ActiveKOT;
  onAction: (kotId: string, nextStatus: string) => void;
  isPending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: kot.id,
    data: { kot },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TicketCard
        kot={kot}
        isDragging={isDragging}
        onAction={onAction}
        isPending={isPending}
      />
    </div>
  );
}

// ─── Droppable Column ─────────────────────────────────────────────────────────

function KanbanColumn({
  status,
  kots,
  onAction,
  isPendingAction,
}: {
  status: KotStatus;
  kots: ActiveKOT[];
  onAction: (kotId: string, nextStatus: string) => void;
  isPendingAction: boolean;
}) {
  const config = COLUMN_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-h-0 h-full rounded-xl border border-border bg-card/50 overflow-hidden">
      {/* Column Header */}
      <div className={cn("p-4 border-b border-border flex justify-between items-center", config.headerClass)}>
        <div className="flex items-center gap-2">
          {config.icon}
          <h3 className="font-semibold text-foreground">{config.label}</h3>
        </div>
        <Badge variant="secondary" className="bg-background">
          {kots.length}
        </Badge>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 overflow-y-auto space-y-4 p-4 transition-colors min-h-[120px]',
          isOver ? 'bg-primary/5' : ''
        )}
      >
        {kots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <span className="text-2xl mb-1 opacity-20">
              {status === 'pending' ? '📋' : status === 'preparing' ? '🍳' : '✅'}
            </span>
            <p className="text-xs text-muted-foreground/60 font-medium">{config.emptyText}</p>
          </div>
        ) : (
          kots.map(kot => (
            <DraggableTicket
              key={kot.id}
              kot={kot}
              onAction={onAction}
              isPending={isPendingAction}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main KDS Page ────────────────────────────────────────────────────────────

export default function Kds() {
  const { selectedBranchId } = useBranchStore();
  const { data: kots, isLoading } = useActiveKOTs(selectedBranchId!);
  const { mutateAsync: updateStatus, isPending } = useUpdateKOTStatus();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedBranchId) return;
    const token = localStorage.getItem('kwickly_auth_token');
    let ws: WebSocket | null = null;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const wsUrl = apiUrl.replace(/^http/, 'ws').replace('/api/v1', '') + `/kds?token=${token}&branchId=${selectedBranchId}`;
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'KOT_UPDATED' || data.type === 'NEW_KOT') {
          queryClient.invalidateQueries({ queryKey: ['kots', 'active', selectedBranchId] });
        }
      };
    } catch (e) {
      console.error('WS error', e);
    }
    return () => {
      ws?.close();
    };
  }, [selectedBranchId, queryClient]);

  const [activeKot, setActiveKot] = React.useState<ActiveKOT | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const grouped = useMemo(() => ({
    pending: kots?.filter(k => k.status === 'pending') ?? [],
    preparing: kots?.filter(k => k.status === 'preparing') ?? [],
    ready: kots?.filter(k => k.status === 'ready') ?? [],
  }), [kots]);

  const handleAction = useCallback(async (kotId: string, nextStatus: string) => {
    const statusLabels: Record<string, string> = {
      preparing: 'In Kitchen',
      ready: 'Ready',
      completed: 'Completed',
    };
    try {
      await updateStatus({ kotId, status: nextStatus });
      if (nextStatus === 'completed') {
        toast.success('Order complete — cleared from board!');
      } else {
        toast.success(`Moved to ${statusLabels[nextStatus] ?? nextStatus}`);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to update ticket');
    }
  }, [updateStatus]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const kot = kots?.find(k => k.id === event.active.id);
    setActiveKot(kot ?? null);
  }, [kots]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveKot(null);
    const { active, over } = event;
    if (!over) return;

    const kotId = active.id as string;
    const draggedKot = kots?.find(k => k.id === kotId);
    if (!draggedKot) return;

    const targetStatus = over.id as KotStatus;
    if (!STATUS_ORDER.includes(targetStatus)) return;

    // Only allow moving forward in the pipeline
    const fromIdx = STATUS_ORDER.indexOf(draggedKot.status as KotStatus);
    const toIdx = STATUS_ORDER.indexOf(targetStatus);
    if (fromIdx === toIdx) return;
    if (toIdx < fromIdx) {
      toast.error('You can only move orders forward in the pipeline.');
      return;
    }

    await handleAction(kotId, targetStatus);
  }, [kots, handleAction]);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 grid grid-cols-3 gap-6 h-full">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl bg-muted/20 animate-pulse h-full" />
        ))}
      </div>
    );
  }


  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col space-y-6 h-full">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              Kitchen Display
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Drag tickets between columns or use action buttons
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Column count pills */}
            <div className="hidden md:flex items-center gap-2 text-[11px] font-bold">
              <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                {grouped.pending.length} New
              </span>
              <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                {grouped.preparing.length} Cooking
              </span>
              <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                {grouped.ready.length} Ready
              </span>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0 overflow-hidden">
          {STATUS_ORDER.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              kots={grouped[status]}
              onAction={handleAction}
              isPendingAction={isPending}
            />
          ))}
        </div>
      </div>

      {/* Drag Overlay — ghost preview of dragged card */}
      <DragOverlay dropAnimation={{ duration: 120, easing: 'ease' }}>
        {activeKot ? (
          <div className="rotate-2 opacity-90 scale-105 shadow-2xl">
            <TicketCard kot={activeKot} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
