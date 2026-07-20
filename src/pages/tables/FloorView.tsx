import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuth';
import { useBranchStore } from '@/store/useBranch';
import api from '@/lib/api';
import { Plus, QrCode, X, Trash2, Download } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function Tables() {
  const { user } = useAuthStore();
  const { selectedBranchId: currentBranchId } = useBranchStore();
  const tenantSlug = user?.tenantId || 'demo';
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: '', capacity: '' });

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables', currentBranchId],
    queryFn: async () => {
      const res = await api.get('/tables', { params: { branchId: currentBranchId } });
      return res.data?.data || [];
    },
    enabled: !!currentBranchId,
  });

  const createTableMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/tables', { ...data, branchId: currentBranchId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', currentBranchId] });
      setIsAddModalOpen(false);
      setFormData({ name: '', capacity: '' });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to create table');
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/tables/${id}`, { params: { branchId: currentBranchId } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', currentBranchId] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to delete table');
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createTableMutation.mutate({
      name: formData.name,
      capacity: parseInt(formData.capacity) || 0,
    });
  };

  const getQrUrl = (token: string) => `https://${tenantSlug}.kwickly.app/menu?t=${token}`;

  const downloadQrCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Table_${activeTable?.name}_QR.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-jakarta text-foreground">Table Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Create and manage your physical tables for Dine-in orders.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-sm font-medium text-sm"
        >
          <Plus size={18} />
          <span>Add Table</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 rounded-3xl bg-muted/50 animate-pulse border border-border/50"></div>
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-border shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-jakarta text-foreground mb-2">No Tables Found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">You haven't set up any tables for this branch yet. Add a table to generate QR codes.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium transition-transform active:scale-95 shadow-sm"
          >
            Create First Table
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table: any) => (
            <div
              key={table.id}
              className="bg-card rounded-3xl p-6 border border-border shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-48"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold font-jakarta text-foreground">{table.name}</h3>
                  <p className="text-sm text-muted-foreground">Capacity: {table.capacity || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setActiveTable(table);
                      setIsQrModalOpen(true);
                    }}
                    className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                    title="View QR"
                  >
                    <QrCode size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this table?')) {
                        deleteTableMutation.mutate(table.id);
                      }
                    }}
                    className="p-2 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
                    title="Delete Table"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  table.status === 'occupied' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                  table.status === 'cleaning' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {table.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-card rounded-3xl shadow-xl w-full max-w-md p-6 border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-jakarta text-foreground">New Table</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Table Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Table 1, Patio 4"
                  className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Capacity (Optional)</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g. 4"
                  className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTableMutation.isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50"
                >
                  {createTableMutation.isPending ? 'Creating...' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {isQrModalOpen && activeTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsQrModalOpen(false)} />
          <div className="relative bg-card rounded-3xl shadow-xl w-full max-w-sm p-8 border border-border animate-in zoom-in-95 duration-200 text-center">
            <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold font-jakarta text-foreground mb-2">{activeTable.name}</h2>
            <p className="text-sm text-muted-foreground mb-8">Scan to view menu & order</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-8">
              <QRCode
                id="qr-code-svg"
                value={getQrUrl(activeTable.qrToken)}
                size={200}
                level="M"
              />
            </div>
            
            <button
              onClick={downloadQrCode}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-transform active:scale-95 shadow-sm"
            >
              <Download size={18} />
              <span>Download QR Code</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
