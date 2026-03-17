import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Trash2, Eye, Download, FileText, Edit2, Share2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Bill } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface BillHistoryProps {
  onBack: () => void;
  onEdit: () => void;
}

export default function BillHistory({ onBack, onEdit }: BillHistoryProps) {
  const { bills, deleteBill, themeColor, plan, customWatermark, setEditingBill } = useAppStore();
  const [viewingBill, setViewingBill] = useState<Bill | null>(null);
  const billRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!billRef.current || !viewingBill) return;
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bill_${viewingBill.customerName}_${new Date(viewingBill.date).getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadImage = async (format: 'png' | 'jpeg') => {
    if (!billRef.current || !viewingBill) return;
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `Bill_${viewingBill.customerName}_${new Date(viewingBill.date).getTime()}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const shareBill = async () => {
    if (!billRef.current || !viewingBill) return;
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Bill_${viewingBill.customerName}_${new Date(viewingBill.date).getTime()}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Invoice',
            text: `Here is the invoice for ${viewingBill.customerName}`,
            files: [file]
          });
        } else {
          alert('Sharing is not supported on this device/browser.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share bill. Please try again.');
    }
  };

  if (viewingBill) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <header className="p-4 flex items-center justify-between glass-panel sticky top-0 z-50">
          <button onClick={() => setViewingBill(null)} className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft size={24} />
          </button>
          <h2 className="font-bold text-lg">View Bill</h2>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          <div 
            ref={billRef}
            className="bg-white text-black p-6 rounded-xl shadow-2xl relative overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {plan === 'free' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-45deg]">
                <h1 className="text-4xl font-black text-gray-400 whitespace-nowrap">Created By Bill Crown 3 + Muzamil</h1>
              </div>
            )}
            {plan === 'premium' && customWatermark.name && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-45deg]">
                <div className="text-center text-gray-400">
                  <h1 className="text-4xl font-black">{customWatermark.name}</h1>
                  <p className="text-xl">{customWatermark.phone}</p>
                </div>
              </div>
            )}

            <div className="text-center mb-6 border-b-2 border-gray-200 pb-4">
              <h1 className="text-3xl font-bold uppercase tracking-wider" style={{ color: themeColor }}>{viewingBill.shopName}</h1>
              <p className="text-gray-500 text-sm mt-1">Invoice / Bill</p>
            </div>

            <div className="flex justify-between mb-6 text-sm">
              <div>
                <p className="text-gray-500 font-semibold">Customer:</p>
                <p className="font-bold text-lg">{viewingBill.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-semibold">Date:</p>
                <p className="font-medium">{new Date(viewingBill.date).toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className="border-b-2 border-gray-800 text-left">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {viewingBill.products.map((p, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-center">{p.quantity} <span className="text-xs text-gray-500">{p.unit}</span></td>
                    <td className="py-3 text-right">{p.price}</td>
                    <td className="py-3 text-right font-bold">{p.price * p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-1/2 space-y-2 text-sm">
                <div className="flex justify-between font-bold text-lg border-b border-gray-200 pb-2">
                  <span>Total:</span>
                  <span>{viewingBill.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Paid:</span>
                  <span>{viewingBill.paidAmount}</span>
                </div>
                <div className="flex justify-between font-bold" style={{ color: viewingBill.remainingAmount > 0 ? '#ef4444' : '#22c55e' }}>
                  <span>Remaining:</span>
                  <span>{viewingBill.remainingAmount}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
              <p>Thank you for your business!</p>
              <p className="mt-1">Created By Muzamil</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            <button onClick={downloadPDF} className="flex flex-col items-center justify-center p-4 rounded-2xl glass-panel hover:bg-white/10 transition-colors">
              <FileText size={24} className="mb-2" style={{ color: themeColor }} />
              <span className="text-xs font-semibold">PDF</span>
            </button>
            <button onClick={() => downloadImage('jpeg')} className="flex flex-col items-center justify-center p-4 rounded-2xl glass-panel hover:bg-white/10 transition-colors">
              <Download size={24} className="mb-2" style={{ color: themeColor }} />
              <span className="text-xs font-semibold">JPG</span>
            </button>
            <button onClick={() => downloadImage('png')} className="flex flex-col items-center justify-center p-4 rounded-2xl glass-panel hover:bg-white/10 transition-colors">
              <Download size={24} className="mb-2" style={{ color: themeColor }} />
              <span className="text-xs font-semibold">PNG</span>
            </button>
            <button onClick={shareBill} className="flex flex-col items-center justify-center p-4 rounded-2xl glass-panel hover:bg-white/10 transition-colors">
              <Share2 size={24} className="mb-2" style={{ color: themeColor }} />
              <span className="text-xs font-semibold">Share</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="p-4 flex items-center justify-between glass-panel sticky top-0 z-50">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-lg">Bill History</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 space-y-4">
        {bills.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No bills generated yet.</p>
          </div>
        ) : (
          bills.map((bill, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={bill.id}
              className="glass-panel p-4 rounded-2xl flex items-center justify-between group"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">{bill.shopName}</h3>
                <p className="text-sm text-white/50">{bill.customerName}</p>
                <p className="text-xs text-white/30 mt-1">{new Date(bill.date).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-lg" style={{ color: themeColor }}>{bill.totalAmount}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewingBill(bill)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={() => {
                      setEditingBill(bill);
                      onEdit();
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => deleteBill(bill.id)}
                    className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
}
