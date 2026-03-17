import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Lock, Calculator } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import html2canvas from 'html2canvas';

interface BudgetCalculatorProps {
  onBack: () => void;
  onUpgrade: () => void;
}

export default function BudgetCalculator({ onBack, onUpgrade }: BudgetCalculatorProps) {
  const { themeColor, plan } = useAppStore();
  const { t } = useTranslation();
  const listRef = useRef<HTMLDivElement>(null);

  const [income, setIncome] = useState('');
  const [houseThings, setHouseThings] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [productMaking, setProductMaking] = useState('');
  const [foods, setFoods] = useState('');
  const [medicine, setMedicine] = useState('');
  const [mechanicalCost, setMechanicalCost] = useState('');
  const [transport, setTransport] = useState('');

  const [showResult, setShowResult] = useState(false);

  const calculateTotalExpenses = () => {
    return (
      (parseFloat(houseThings) || 0) +
      (parseFloat(labourCost) || 0) +
      (parseFloat(productMaking) || 0) +
      (parseFloat(foods) || 0) +
      (parseFloat(medicine) || 0) +
      (parseFloat(mechanicalCost) || 0) +
      (parseFloat(transport) || 0)
    );
  };

  const calculateRemaining = () => {
    return (parseFloat(income) || 0) - calculateTotalExpenses();
  };

  const handleCalculate = () => {
    if (!income || !houseThings || !foods || !medicine) {
      alert('Please fill all required fields (Income, House Things, Foods, Medicine)');
      return;
    }
    setShowResult(true);
  };

  const downloadList = async () => {
    if (!listRef.current) return;
    try {
      const canvas = await html2canvas(listRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `Budget_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  if (plan === 'free') {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <header className="p-4 flex items-center gap-4 glass-panel sticky top-0 z-50">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{t('budgetCalculator')}</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 glow-box" style={{ backgroundColor: `${themeColor}20` }}>
            <Lock size={48} style={{ color: themeColor }} />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('proFeatureOnly')}</h2>
          <p className="text-white/50 mb-8">{t('unlockBudget')}</p>
          <button onClick={onUpgrade} className="btn-primary w-full max-w-xs" style={{ backgroundColor: themeColor }}>
            {t('goPro')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <header className="p-4 flex items-center gap-4 glass-panel sticky top-0 z-50">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{t('budgetCalculator')}</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-24">
        {!showResult ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-panel p-4 rounded-2xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('totalIncome')} *</label>
                <input type="number" value={income} onChange={e => setIncome(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl space-y-4">
              <h3 className="font-bold text-lg mb-2">{t('expenses')}</h3>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('houseThings')} *</label>
                <input type="number" value={houseThings} onChange={e => setHouseThings(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('foods')} *</label>
                <input type="number" value={foods} onChange={e => setFoods(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('medicine')} *</label>
                <input type="number" value={medicine} onChange={e => setMedicine(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('labourCost')}</label>
                <input type="number" value={labourCost} onChange={e => setLabourCost(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('productMaking')}</label>
                <input type="number" value={productMaking} onChange={e => setProductMaking(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('mechanicalCost')}</label>
                <input type="number" value={mechanicalCost} onChange={e => setMechanicalCost(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">{t('transport')}</label>
                <input type="number" value={transport} onChange={e => setTransport(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[var(--theme-color)] transition-colors" placeholder="0" />
              </div>
            </div>

            <button onClick={handleCalculate} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg mt-6" style={{ backgroundColor: themeColor }}>
              <Calculator size={24} />
              {t('calculate')}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div 
              ref={listRef}
              className="bg-[#ffffff] text-[#000000] p-6 rounded-xl shadow-2xl relative overflow-hidden"
            >
              <div className="text-center mb-6 border-b-2 border-[#e5e7eb] pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider" style={{ color: themeColor }}>{t('budgetTitle')}</h1>
                <p className="text-[#6b7280] text-sm mt-1">{new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-bold text-lg border-b border-[#e5e7eb] pb-2">
                  <span>{t('totalIncome')}:</span>
                  <span style={{ color: '#22c55e' }}>{income}</span>
                </div>
                
                <div className="pt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#4b5563]">{t('houseThings')}:</span>
                    <span className="font-medium">{houseThings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4b5563]">{t('foods')}:</span>
                    <span className="font-medium">{foods || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4b5563]">{t('medicine')}:</span>
                    <span className="font-medium">{medicine || 0}</span>
                  </div>
                  {labourCost && (
                    <div className="flex justify-between">
                      <span className="text-[#4b5563]">{t('labourCost')}:</span>
                      <span className="font-medium">{labourCost}</span>
                    </div>
                  )}
                  {productMaking && (
                    <div className="flex justify-between">
                      <span className="text-[#4b5563]">{t('productMaking')}:</span>
                      <span className="font-medium">{productMaking}</span>
                    </div>
                  )}
                  {mechanicalCost && (
                    <div className="flex justify-between">
                      <span className="text-[#4b5563]">{t('mechanicalCost')}:</span>
                      <span className="font-medium">{mechanicalCost}</span>
                    </div>
                  )}
                  {transport && (
                    <div className="flex justify-between">
                      <span className="text-[#4b5563]">{t('transport')}:</span>
                      <span className="font-medium">{transport}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t-2 border-[#1f2937] pt-4 space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('totalBudget')} ({t('expenses')}):</span>
                  <span style={{ color: '#ef4444' }}>{calculateTotalExpenses()}</span>
                </div>
                <div className="flex justify-between font-bold text-xl">
                  <span>{t('remainingBalance')}:</span>
                  <span style={{ color: calculateRemaining() >= 0 ? '#22c55e' : '#ef4444' }}>
                    {calculateRemaining()}
                  </span>
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-[#9ca3af]">
                <p>{t('createdBy')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowResult(false)} className="glass-panel py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                {t('backToEdit')}
              </button>
              <button onClick={downloadList} className="btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2" style={{ backgroundColor: themeColor }}>
                <Download size={20} />
                {t('downloadList')}
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
