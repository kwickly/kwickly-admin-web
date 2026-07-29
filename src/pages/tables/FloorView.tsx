import { Icons } from '@/components/shared/icons';
import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuth';
import { useBranchStore } from '@/store/useBranch';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from '@/hooks/api/useTables';

import QRCode from 'react-qr-code';
import { Can } from '@/components/shared/Can';

export default function Tables() {
  const { user } = useAuthStore();
  const { selectedBranchId: currentBranchId } = useBranchStore();
  const tenantSlug = user?.tenantId || 'demo';
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: '', capacity: '', status: 'available' });

  const { data: tables = [], isLoading } = useTables(currentBranchId);
  const createTableMutation = useCreateTable();
  const updateTableMutation = useUpdateTable();
  const deleteTableMutation = useDeleteTable();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranchId) return;
    createTableMutation.mutate({
      branchId: currentBranchId,
      name: formData.name,
      capacity: parseInt(formData.capacity) || 0,
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setFormData({ name: '', capacity: '', status: 'available' });
      }
    });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranchId || !activeTable) return;
    updateTableMutation.mutate({
      id: activeTable.id,
      branchId: currentBranchId,
      name: formData.name,
      capacity: parseInt(formData.capacity) || 0,
      status: formData.status as any,
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setActiveTable(null);
      }
    });
  };

  const openEditModal = (table: any) => {
    setActiveTable(table);
    setFormData({
      name: table.name,
      capacity: table.capacity?.toString() || '',
      status: table.status,
    });
    setIsEditModalOpen(true);
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
    <div className="flex flex-col space-y-6 flex-1 h-full w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-jakarta text-foreground">Table Management</h1>
          <p className="text-muted-foreground mt-2 text-sm">Create and manage your physical tables for Dine-in orders.</p>
        </div>
        <Can perform="tables:manage">
          <button
            onClick={() => {
              setFormData({ name: '', capacity: '', status: 'available' });
              setIsAddModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 transition-all active:scale-95 shadow-sm font-medium text-sm cursor-pointer"
          >
            <Icons.Plus size={18} />
            <span>Add Table</span>
          </button>
        </Can>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 rounded-lg bg-muted/50 animate-pulse border border-border/50"></div>
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-border shadow-sm">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <Icons.QrCode className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-xl font-bold font-jakarta text-foreground mb-2">No Tables Found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">You haven't set up any tables for this branch yet. Add a table to generate QR codes.</p>
          <Can perform="tables:manage">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              Create First Table
            </button>
          </Can>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table: any) => (
            <div
              key={table.id}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-sm transition-all group flex flex-col justify-between h-48"
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
                    className="p-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors cursor-pointer"
                    title="View QR"
                  >
                    <Icons.QrCode size={16} />
                  </button>
                  <Can perform="tables:manage">
                    <button
                      onClick={() => openEditModal(table)}
                      className="p-2 bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors cursor-pointer"
                      title="Edit Table"
                    >
                      <Icons.Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this table?')) {
                          deleteTableMutation.mutate({ id: table.id, branchId: currentBranchId! });
                        }
                      }}
                      className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer"
                      title="Delete Table"
                    >
                      <Icons.Trash2 size={16} />
                    </button>
                  </Can>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  table.status === 'occupied' ? 'bg-warning/10 text-warning dark:text-warning/80' :
                  table.status === 'cleaning' ? 'bg-info/10 text-info dark:text-info/80' :
                  'bg-success/10 text-success dark:text-success/80'
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
          <div className="relative bg-card rounded-xl shadow-sm w-full max-w-md p-6 border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-jakarta text-foreground">New Table</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
                <Icons.X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Table Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Table 1, Patio 4"
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Capacity (Optional)</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g. 4"
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTableMutation.isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {createTableMutation.isPending ? 'Creating...' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {isEditModalOpen && activeTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-card rounded-xl shadow-sm w-full max-w-md p-6 border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-jakarta text-foreground">Edit Table</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
                <Icons.X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Table Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateTableMutation.isPending}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {updateTableMutation.isPending ? 'Saving...' : 'Save Changes'}
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
          <div className="relative bg-card rounded-xl shadow-sm w-full max-w-sm p-8 border border-border animate-in zoom-in-95 duration-200 text-center">
            <button onClick={() => setIsQrModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground cursor-pointer">
              <Icons.X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold font-jakarta text-foreground mb-2">{activeTable.name}</h2>
            <p className="text-sm text-muted-foreground mb-8">Scan to view menu & order</p>
            
            <div className="bg-white p-4 rounded-lg inline-block mx-auto mb-8">
              <QRCode
                id="qr-code-svg"
                value={getQrUrl(activeTable.qrToken)}
                size={200}
                level="M"
              />
            </div>
            
            <button
              onClick={downloadQrCode}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              <Icons.Download size={18} />
              <span>Download QR Code</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
