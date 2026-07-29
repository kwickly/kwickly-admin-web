import { Icons } from '@/components/shared/icons';
import { useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';

type IconEntry = { name: string; icon: LucideIcon; category: string };

const ALL_ICONS: IconEntry[] = [
  // Navigation & Layout
  { name: 'LayoutDashboard', icon: Icons.LayoutDashboard, category: 'Navigation' },
  { name: 'LayoutGrid', icon: Icons.LayoutGrid, category: 'Navigation' },
  { name: 'Layout', icon: Icons.Layout, category: 'Navigation' },
  { name: 'Menu', icon: Icons.Menu, category: 'Navigation' },
  { name: 'MenuSquare', icon: Icons.MenuSquare, category: 'Navigation' },
  { name: 'ChevronLeft', icon: Icons.ChevronLeft, category: 'Navigation' },
  { name: 'ChevronRight', icon: Icons.ChevronRight, category: 'Navigation' },
  { name: 'ChevronRightIcon', icon: Icons.ChevronRightIcon, category: 'Navigation' },
  { name: 'ChevronDownIcon', icon: Icons.ChevronDownIcon, category: 'Navigation' },
  { name: 'ChevronUpIcon', icon: Icons.ChevronUpIcon, category: 'Navigation' },
  { name: 'ArrowLeft', icon: Icons.ArrowLeft, category: 'Navigation' },
  { name: 'ArrowRight', icon: Icons.ArrowRight, category: 'Navigation' },
  { name: 'ArrowUpRight', icon: Icons.ArrowUpRight, category: 'Navigation' },
  { name: 'ArrowDownRight', icon: Icons.ArrowDownRight, category: 'Navigation' },
  { name: 'ArrowRightCircle', icon: Icons.ArrowRightCircle, category: 'Navigation' },
  { name: 'PanelLeftIcon', icon: Icons.PanelLeftIcon, category: 'Navigation' },
  { name: 'ExternalLink', icon: Icons.ExternalLink, category: 'Navigation' },

  // Actions
  { name: 'Plus', icon: Icons.Plus, category: 'Actions' },
  { name: 'Minus', icon: Icons.Minus, category: 'Actions' },
  { name: 'Edit', icon: Icons.Edit, category: 'Actions' },
  { name: 'Edit2', icon: Icons.Edit2, category: 'Actions' },
  { name: 'Trash', icon: Icons.Trash, category: 'Actions' },
  { name: 'Trash2', icon: Icons.Trash2, category: 'Actions' },
  { name: 'Delete', icon: Icons.Delete, category: 'Actions' },
  { name: 'Save', icon: Icons.Save, category: 'Actions' },
  { name: 'Download', icon: Icons.Download, category: 'Actions' },
  { name: 'Send', icon: Icons.Send, category: 'Actions' },
  { name: 'Search', icon: Icons.Search, category: 'Actions' },
  { name: 'SearchIcon', icon: Icons.SearchIcon, category: 'Actions' },
  { name: 'Filter', icon: Icons.Filter, category: 'Actions' },
  { name: 'RefreshCw', icon: Icons.RefreshCw, category: 'Actions' },
  { name: 'RefreshCcw', icon: Icons.RefreshCcw, category: 'Actions' },
  { name: 'Copy', icon: Icons.Eye, category: 'Actions' },
  { name: 'Printer', icon: Icons.Printer, category: 'Actions' },
  { name: 'LogIn', icon: Icons.LogIn, category: 'Actions' },
  { name: 'LogOut', icon: Icons.LogOut, category: 'Actions' },
  { name: 'Lock', icon: Icons.Lock, category: 'Actions' },
  { name: 'Eye', icon: Icons.Eye, category: 'Actions' },
  { name: 'EyeOff', icon: Icons.EyeOff, category: 'Actions' },
  { name: 'X', icon: Icons.X, category: 'Actions' },
  { name: 'XCircle', icon: Icons.XCircle, category: 'Actions' },
  { name: 'XIcon', icon: Icons.XIcon, category: 'Actions' },
  { name: 'ToggleLeft', icon: Icons.ToggleLeft, category: 'Actions' },
  { name: 'ToggleRight', icon: Icons.ToggleRight, category: 'Actions' },
  { name: 'GripVertical', icon: Icons.GripVertical, category: 'Actions' },
  { name: 'MoreVertical', icon: Icons.MoreVertical, category: 'Actions' },
  { name: 'Sliders', icon: Icons.Sliders, category: 'Actions' },
  { name: 'MousePointer2', icon: Icons.MousePointer2, category: 'Actions' },

  // Status / Feedback
  { name: 'Check', icon: Icons.Check, category: 'Status' },
  { name: 'CheckCircle', icon: Icons.CheckCircle, category: 'Status' },
  { name: 'CheckCircle2', icon: Icons.CheckCircle2, category: 'Status' },
  { name: 'CheckIcon', icon: Icons.CheckIcon, category: 'Status' },
  { name: 'CircleCheckIcon', icon: Icons.CircleCheckIcon, category: 'Status' },
  { name: 'AlertCircle', icon: Icons.AlertCircle, category: 'Status' },
  { name: 'AlertTriangle', icon: Icons.AlertTriangle, category: 'Status' },
  { name: 'TriangleAlertIcon', icon: Icons.TriangleAlertIcon, category: 'Status' },
  { name: 'OctagonXIcon', icon: Icons.OctagonXIcon, category: 'Status' },
  { name: 'Ban', icon: Icons.Ban, category: 'Status' },
  { name: 'Info', icon: Icons.Info, category: 'Status' },
  { name: 'InfoIcon', icon: Icons.InfoIcon, category: 'Status' },
  { name: 'HelpCircle', icon: Icons.HelpCircle, category: 'Status' },
  { name: 'Loader2', icon: Icons.Loader2, category: 'Status' },
  { name: 'Loader2Icon', icon: Icons.Loader2Icon, category: 'Status' },
  { name: 'Bell', icon: Icons.Bell, category: 'Status' },
  { name: 'BellOff', icon: Icons.BellOff, category: 'Status' },
  { name: 'PauseCircle', icon: Icons.PauseCircle, category: 'Status' },
  { name: 'PlayCircle', icon: Icons.PlayCircle, category: 'Status' },
  { name: 'Play', icon: Icons.Play, category: 'Status' },

  // Restaurant / Food
  { name: 'Utensils', icon: Icons.Utensils, category: 'Restaurant' },
  { name: 'UtensilsCrossed', icon: Icons.UtensilsCrossed, category: 'Restaurant' },
  { name: 'ChefHat', icon: Icons.ChefHat, category: 'Restaurant' },
  { name: 'Store', icon: Icons.Store, category: 'Restaurant' },
  { name: 'QrCode', icon: Icons.QrCode, category: 'Restaurant' },
  { name: 'Receipt', icon: Icons.Receipt, category: 'Restaurant' },
  { name: 'ReceiptText', icon: Icons.ReceiptText, category: 'Restaurant' },
  { name: 'ShoppingCart', icon: Icons.ShoppingCart, category: 'Restaurant' },
  { name: 'ShoppingBag', icon: Icons.ShoppingBag, category: 'Restaurant' },
  { name: 'Package', icon: Icons.Package, category: 'Restaurant' },
  { name: 'PackageCheck', icon: Icons.PackageCheck, category: 'Restaurant' },
  { name: 'PackageOpen', icon: Icons.PackageOpen, category: 'Restaurant' },
  { name: 'Flame', icon: Icons.Flame, category: 'Restaurant' },
  { name: 'Beef', icon: Icons.Beef, category: 'Restaurant' },
  { name: 'Wheat', icon: Icons.Wheat, category: 'Restaurant' },
  { name: 'Leaf', icon: Icons.Leaf, category: 'Restaurant' },
  { name: 'Droplet', icon: Icons.Droplet, category: 'Restaurant' },
  { name: 'Truck', icon: Icons.Truck, category: 'Restaurant' },
  { name: 'Timer', icon: Icons.Timer, category: 'Restaurant' },
  { name: 'Clock', icon: Icons.Clock, category: 'Restaurant' },
  { name: 'Tag', icon: Icons.Tag, category: 'Restaurant' },
  { name: 'Percent', icon: Icons.Percent, category: 'Restaurant' },
  { name: 'Gift', icon: Icons.Gift, category: 'Restaurant' },
  { name: 'Star', icon: Icons.Star, category: 'Restaurant' },

  // Finance / Analytics
  { name: 'DollarSign', icon: Icons.DollarSign, category: 'Finance' },
  { name: 'Wallet', icon: Icons.Wallet, category: 'Finance' },
  { name: 'Banknote', icon: Icons.Banknote, category: 'Finance' },
  { name: 'CreditCard', icon: Icons.CreditCard, category: 'Finance' },
  { name: 'BarChart', icon: Icons.BarChart, category: 'Finance' },
  { name: 'BarChart2', icon: Icons.BarChart2, category: 'Finance' },
  { name: 'BarChart3', icon: Icons.BarChart3, category: 'Finance' },
  { name: 'TrendingUp', icon: Icons.TrendingUp, category: 'Finance' },
  { name: 'TrendingDown', icon: Icons.TrendingDown, category: 'Finance' },
  { name: 'Activity', icon: Icons.Activity, category: 'Finance' },
  { name: 'Target', icon: Icons.Target, category: 'Finance' },

  // Users / People
  { name: 'User', icon: Icons.User, category: 'People' },
  { name: 'Users', icon: Icons.Users, category: 'People' },
  { name: 'UserCheck', icon: Icons.UserCheck, category: 'People' },
  { name: 'UserIcon', icon: Icons.UserIcon, category: 'People' },
  { name: 'Fingerprint', icon: Icons.Fingerprint, category: 'People' },
  { name: 'HeartHandshake', icon: Icons.HeartHandshake, category: 'People' },
  { name: 'Award', icon: Icons.Award, category: 'People' },

  // Infrastructure / Tech
  { name: 'Settings', icon: Icons.Settings, category: 'System' },
  { name: 'Settings2', icon: Icons.Settings2, category: 'System' },
  { name: 'Server', icon: Icons.Server, category: 'System' },
  { name: 'Database', icon: Icons.Database, category: 'System' },
  { name: 'Cpu', icon: Icons.Cpu, category: 'System' },
  { name: 'Wifi', icon: Icons.Wifi, category: 'System' },
  { name: 'Terminal', icon: Icons.Terminal, category: 'System' },
  { name: 'Smartphone', icon: Icons.Smartphone, category: 'System' },
  { name: 'Tablet', icon: Icons.Tablet, category: 'System' },
  { name: 'MonitorCheck', icon: Icons.MonitorCheck, category: 'System' },
  { name: 'MonitorSmartphone', icon: Icons.MonitorSmartphone, category: 'System' },
  { name: 'Globe', icon: Icons.Globe, category: 'System' },
  { name: 'Layers', icon: Icons.Layers, category: 'System' },
  { name: 'Blocks', icon: Icons.Blocks, category: 'System' },
  { name: 'ListTree', icon: Icons.ListTree, category: 'System' },
  { name: 'BrainCircuit', icon: Icons.BrainCircuit, category: 'System' },
  { name: 'Zap', icon: Icons.Zap, category: 'System' },
  { name: 'Sparkles', icon: Icons.Sparkles, category: 'System' },
  { name: 'Shield', icon: Icons.Shield, category: 'System' },
  { name: 'ShieldCheck', icon: Icons.ShieldCheck, category: 'System' },
  { name: 'ShieldAlert', icon: Icons.ShieldAlert, category: 'System' },
  { name: 'Moon', icon: Icons.Moon, category: 'System' },
  { name: 'Sun', icon: Icons.Sun, category: 'System' },
  { name: 'Palette', icon: Icons.Palette, category: 'System' },
  { name: 'Type', icon: Icons.Type, category: 'System' },
  { name: 'Square', icon: Icons.Square, category: 'System' },
  { name: 'ImageIcon', icon: Icons.ImageIcon, category: 'System' },
  { name: 'FileText', icon: Icons.FileText, category: 'System' },
  { name: 'FileSpreadsheet', icon: Icons.FileSpreadsheet, category: 'System' },
  { name: 'ScrollText', icon: Icons.ScrollText, category: 'System' },
  { name: 'LifeBuoy', icon: Icons.LifeBuoy, category: 'System' },
  { name: 'MessageCircle', icon: Icons.MessageCircle, category: 'System' },
  { name: 'MessageSquare', icon: Icons.MessageSquare, category: 'System' },
  { name: 'MessageSquareText', icon: Icons.MessageSquareText, category: 'System' },
  { name: 'Mail', icon: Icons.Mail, category: 'System' },
  { name: 'Megaphone', icon: Icons.Megaphone, category: 'System' },
  { name: 'Phone', icon: Icons.Phone, category: 'System' },
  { name: 'MapPin', icon: Icons.MapPin, category: 'System' },
  { name: 'Building', icon: Icons.Building, category: 'System' },
  { name: 'Building2', icon: Icons.Building2, category: 'System' },
  { name: 'Calendar', icon: Icons.Calendar, category: 'System' },
  { name: 'CalendarClock', icon: Icons.CalendarClock, category: 'System' },
  { name: 'CalendarDays', icon: Icons.CalendarDays, category: 'System' },
];

const CATEGORIES = ['All', 'Navigation', 'Actions', 'Status', 'Restaurant', 'Finance', 'People', 'System'];

export function IconGrid() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return ALL_ICONS.filter(i => {
      const matchesQuery = i.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || i.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="space-y-6">

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search icons..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-md border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {ALL_ICONS.length} icons
      </p>

      {/* Icon Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {filtered.map(({ name, icon: IconComponent }) => (
          <button
            key={name}
            title={name}
            onClick={() => navigator.clipboard.writeText(`Icons.${name}`)}
            className="flex flex-col items-center gap-2.5 p-2 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all group cursor-pointer"
          >
            <IconComponent className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
            <span className="text-[9px] text-muted-foreground group-hover:text-foreground truncate w-full text-center font-mono">
              {name}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.Search className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground">No icons found</p>
          <p className="text-xs text-muted-foreground">Try a different search term</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Click any icon to copy <span className="font-mono">Icons.Name</span> to clipboard.
        All icons sourced from <span className="font-mono">lucide-react</span> via <span className="font-mono">@/components/shared/icons</span>.
      </p>

    </div>
  );
}
