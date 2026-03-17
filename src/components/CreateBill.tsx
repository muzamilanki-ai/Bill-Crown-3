import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Product, Bill } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Plus, Trash2, Download, Check, FileText, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from '../hooks/useTranslation';

interface CreateBillProps {
  onBack: () => void;
}

export default function CreateBill({ onBack }: CreateBillProps) {
  const { plan, themeColor, addBill, updateBill, customWatermark, editingBill } = useAppStore();
  const { t } = useTranslation();
  const [shopName, setShopName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  
  const billRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingBill) {
      setShopName(editingBill.shopName);
      setCustomerName(editingBill.customerName);
      setProducts(editingBill.products);
      setPaidAmount(editingBill.paidAmount);
    }
  }, [editingBill]);

  const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const remainingAmount = totalAmount - paidAmount;

  const handleAddProduct = () => {
    setProducts([...products, { id: uuidv4(), name: '', quantity: 1, price: 0, unit: 'pc' }]);
  };

  const handleUpdateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleGenerate = () => {
    if (!shopName || !customerName || products.length === 0) {
      alert('Please fill all required fields and add at least one product.');
      return;
    }

    const newBill: Bill = {
      id: editingBill ? editingBill.id : uuidv4(),
      shopName,
      customerName,
      products,
      totalAmount,
      paidAmount,
      remainingAmount,
      date: editingBill ? editingBill.date : new Date().toISOString(),
    };

    setCurrentBill(newBill);
    if (editingBill) {
      updateBill(newBill.id, newBill);
    } else {
      addBill(newBill);
    }
    setShowPreview(true);
  };

  const downloadPDF = async () => {
    if (!billRef.current) return;
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bill_${customerName}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadImage = async (format: 'png' | 'jpeg') => {
    if (!billRef.current) return;
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `Bill_${customerName}_${new Date().getTime()}.${format}`;
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
    if (!billRef.current) return;
    try {
      const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Bill_${customerName}_${new Date().getTime()}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Invoice',
            text: `Here is the invoice for ${customerName}`,
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

  if (showPreview && currentBill) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <header className="p-4 flex items-center justify-between glass-panel sticky top-0 z-50">
          <button onClick={() => setShowPreview(false)} className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft size={24} />
          </button>
          <h2 className="font-bold text-lg">Preview Bill</h2>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          {/* Bill Container to capture */}
          <div 
            ref={billRef}
            className="bg-[#ffffff] text-[#000000] p-6 rounded-xl shadow-2xl relative overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {/* Watermark */}
            {plan === 'free' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-45deg]">
                <h1 className="text-4xl font-black text-[#9ca3af] whitespace-nowrap">Created By Bill Crown 3 + Muzamil</h1>
              </div>
            )}
            {plan === 'premium' && customWatermark.name && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-45deg]">
                <div className="text-center text-[#9ca3af]">
                  <h1 className="text-4xl font-black">{customWatermark.name}</h1>
                  <p className="text-xl">{customWatermark.phone}</p>
                </div>
              </div>
            )}

            <div className="text-center mb-6 border-b-2 border-[#e5e7eb] pb-4">
              <h1 className="text-3xl font-bold uppercase tracking-wider" style={{ color: themeColor }}>{currentBill.shopName}</h1>
              <p className="text-[#6b7280] text-sm mt-1">{t('invoice')}</p>
            </div>

            <div className="flex justify-between mb-6 text-sm">
              <div>
                <p className="text-[#6b7280] font-semibold">{t('customer')}:</p>
                <p className="font-bold text-lg">{currentBill.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-[#6b7280] font-semibold">{t('date')}:</p>
                <p className="font-medium">{new Date(currentBill.date).toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className="border-b-2 border-[#1f2937] text-left">
                  <th className="py-2">{t('item')}</th>
                  <th className="py-2 text-center">{t('quantity')}</th>
                  <th className="py-2 text-right">{t('price')}</th>
                  <th className="py-2 text-right">{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                {currentBill.products.map((p, i) => (
                  <tr key={i} className="border-b border-[#e5e7eb]">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-center">{p.quantity} <span className="text-xs text-[#6b7280]">{p.unit}</span></td>
                    <td className="py-3 text-right">{p.price}</td>
                    <td className="py-3 text-right font-bold">{p.price * p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-1/2 space-y-2 text-sm">
                <div className="flex justify-between font-bold text-lg border-b border-[#e5e7eb] pb-2">
                  <span>{t('total')}:</span>
                  <span>{currentBill.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[#4b5563]">
                  <span>{t('paid')}:</span>
                  <span>{currentBill.paidAmount}</span>
                </div>
                <div className="flex justify-between font-bold" style={{ color: currentBill.remainingAmount > 0 ? '#ef4444' : '#22c55e' }}>
                  <span>{t('remaining')}:</span>
                  <span>{currentBill.remainingAmount}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-xs text-[#9ca3af] border-t border-[#e5e7eb] pt-4">
              <p>{t('thankYou')}</p>
              <p className="mt-1">{t('createdBy')}</p>
            </div>
          </div>

          {/* Download Actions */}
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
        <h2 className="font-bold text-lg">{editingBill ? 'Edit Bill' : 'Create Bill'}</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-2xl">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{t('shopName')}</label>
            <input 
              type="text" 
              placeholder={t('shopName')} 
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--theme-color)] transition-colors mb-3"
            />
            <input 
              type="text" 
              placeholder={t('customerName')} 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--theme-color)] transition-colors"
            />
          </div>

          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">{t('products')}</label>
              <button 
                onClick={handleAddProduct}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                style={{ color: themeColor }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="space-y-3">
              {products.map((product, index) => (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  key={product.id} 
                  className="bg-black/30 border border-white/5 rounded-xl p-3 relative group"
                >
                  <button 
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} className="text-white" />
                  </button>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Item name" 
                      value={product.name}
                      onChange={e => handleUpdateProduct(product.id, 'name', e.target.value)}
                      className="col-span-12 bg-transparent border-b border-white/10 px-2 py-1 text-sm focus:outline-none focus:border-[var(--theme-color)]"
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      value={product.quantity || ''}
                      onChange={e => handleUpdateProduct(product.id, 'quantity', Number(e.target.value))}
                      className="col-span-3 bg-white/5 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-1 focus:ring-[var(--theme-color)]"
                    />
                    <select 
                      value={product.unit}
                      onChange={e => handleUpdateProduct(product.id, 'unit', e.target.value)}
                      className="col-span-4 bg-white/5 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--theme-color)] appearance-none"
                    >
                      <option value="pc" className="bg-gray-900">pc</option>
                      <option value="kg" className="bg-gray-900">kg</option>
                      <option value="ltr" className="bg-gray-900">ltr</option>
                      <option value="box" className="bg-gray-900">box</option>
                    </select>
                    <input 
                      type="number" 
                      placeholder="Price" 
                      value={product.price || ''}
                      onChange={e => handleUpdateProduct(product.id, 'price', Number(e.target.value))}
                      className="col-span-5 bg-white/5 rounded-lg px-2 py-2 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[var(--theme-color)]"
                    />
                  </div>
                </motion.div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
                  No products added yet.
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Payment Summary</label>
            
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-white/70">Total Amount:</span>
              <span className="font-bold text-lg">{totalAmount}</span>
            </div>
            
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-white/70">Paid Amount:</span>
              <input 
                type="number" 
                value={paidAmount || ''}
                onChange={e => setPaidAmount(Number(e.target.value))}
                className="w-24 bg-white/10 rounded-lg px-3 py-1 text-right focus:outline-none focus:ring-1 focus:ring-[var(--theme-color)]"
              />
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-white/10 text-sm">
              <span className="text-white/70">Remaining:</span>
              <span className="font-bold text-xl" style={{ color: remainingAmount > 0 ? '#ef4444' : '#22c55e' }}>
                {remainingAmount}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg mt-8"
          style={{ backgroundColor: themeColor }}
        >
          <Check size={20} /> {editingBill ? 'Update Bill' : 'Generate Bill'}
        </button>
      </main>
    </div>
  );
}
