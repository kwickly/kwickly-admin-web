import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuth';
import { useBranchStore } from '@/store/useBranch';
import api from '@/lib/api';
import { Printer, Download, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function QRManager() {
  const { user } = useAuthStore();
  const { selectedBranchId: currentBranchId } = useBranchStore();
  const tenantSlug = user?.tenantId || 'demo';
  const printRef = useRef<HTMLDivElement>(null);

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables', currentBranchId],
    queryFn: async () => {
      const res = await api.get('/tables', { params: { branchId: currentBranchId } });
      return res.data?.data || [];
    },
    enabled: !!currentBranchId,
  });

  const getQrUrl = (token: string) => `https://${tenantSlug}.kwickly.app/menu?t=${token}`;

  const handlePrint = () => {
    window.print();
  };

  const downloadQrCode = (tableId: string, tableName: string) => {
    const svg = document.getElementById(`qr-code-svg-${tableId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        // Add text label
        ctx.fillStyle = 'black';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tableName, canvas.width / 2, canvas.height - 10);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Table_${tableName}_QR.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold font-jakarta text-foreground">QR Manager</h1>
          <p className="text-muted-foreground mt-1 text-sm">Download or print QR codes for all your tables.</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-sm font-medium text-sm"
        >
          <Printer size={18} />
          <span>Print All QRs</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 no-print">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-muted/50 animate-pulse border border-border/50"></div>
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-border shadow-sm no-print">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-jakarta text-foreground mb-2">No QR Codes to Print</h3>
          <p className="text-muted-foreground max-w-sm mb-6">Set up your tables in the Floor View to generate QR codes.</p>
        </div>
      ) : (
        <div 
          ref={printRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 print:grid-cols-2 print:gap-4 print:w-full"
        >
          {tables.map((table: any) => (
            <div
              key={table.id}
              className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center justify-between print:border-2 print:border-gray-800 print:break-inside-avoid print:shadow-none"
            >
              <h3 className="text-2xl font-bold font-jakarta text-foreground mb-4 text-center">{table.name}</h3>
              
              <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-6">
                <QRCode
                  id={`qr-code-svg-${table.id}`}
                  value={getQrUrl(table.qrToken)}
                  size={180}
                  level="M"
                />
              </div>

              <div className="w-full flex justify-center no-print">
                <button
                  onClick={() => downloadQrCode(table.id, table.name)}
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 font-medium transition-transform active:scale-95 shadow-sm text-sm"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .print\\:border-2 {
            border-width: 2px !important;
          }
          .print\\:border-gray-800 {
            border-color: #1f2937 !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          #root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .max-w-7xl > div:last-child {
            visibility: visible;
          }
          .max-w-7xl > div:last-child * {
            visibility: visible;
          }
        }
      `}} />
    </div>
  );
}
