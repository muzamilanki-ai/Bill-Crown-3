import { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Check, Crown, Zap, Key } from 'lucide-react';

interface UpgradeProps {
  onBack: () => void;
}

export default function Upgrade({ onBack }: UpgradeProps) {
  const { plan, setPlan, setActivationKey, themeColor } = useAppStore();
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');

  const handleActivate = () => {
    if (keyInput === 'muzamil29') {
      setPlan('pro');
      setActivationKey(keyInput);
      setError('');
      alert('Pro Plan Activated!');
    } else if (keyInput === 'limazum92') {
      setPlan('premium');
      setActivationKey(keyInput);
      setError('');
      alert('Premium Plan Activated!');
    } else {
      setError('Invalid Activation Key');
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="p-4 flex items-center justify-between glass-panel sticky top-0 z-50">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-lg">Upgrade Plan</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center glow-box bg-black/50 mb-4">
            <Crown size={32} style={{ color: themeColor }} />
          </div>
          <h2 className="text-2xl font-bold">Current Plan: <span className="uppercase" style={{ color: themeColor }}>{plan === 'free' ? 'UNPRO' : plan}</span></h2>
          <p className="text-white/50 text-sm mt-2">Upgrade to unlock premium features and remove watermarks.</p>
        </div>

        <div className="grid gap-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-white/10 px-4 py-1 rounded-bl-xl text-xs font-bold">PRO</div>
            <h3 className="text-xl font-bold mb-1">Plan 1</h3>
            <p className="text-2xl font-black mb-4" style={{ color: themeColor }}>1000 PKR</p>
            <ul className="space-y-2 text-sm text-white/70 mb-6">
              <li className="flex items-center gap-2"><Check size={16} style={{ color: themeColor }} /> No watermark</li>
              <li className="flex items-center gap-2"><Check size={16} style={{ color: themeColor }} /> 2 game modes unlocked</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden glow-box">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-1 rounded-bl-xl text-xs font-bold">PREMIUM</div>
            <h3 className="text-xl font-bold mb-1">Plan 2</h3>
            <p className="text-2xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">1799 PKR</p>
            <ul className="space-y-2 text-sm text-white/70 mb-6">
              <li className="flex items-center gap-2"><Check size={16} className="text-pink-500" /> No watermark</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-pink-500" /> Custom watermark</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-pink-500" /> All 3 game modes unlocked</li>
            </ul>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl mt-8">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" /> Payment Instructions
          </h3>
          <div className="bg-white rounded-xl p-4 mb-4 flex justify-center">
            {/* Placeholder for QR Code */}
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-black font-bold border-4 border-green-500 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Crown size={100} />
              </div>
              <span className="relative z-10 text-center">
                EasyPaisa QR<br/>
                <span className="text-sm font-normal">03349825814</span>
              </span>
            </div>
          </div>
          <div className="text-sm text-white/70 space-y-2 mb-6">
            <p>1. Pay via EasyPaisa to <strong>03349825814</strong></p>
            <p>2. Send SMS: <strong>"Bill 3"</strong> to 03349825814</p>
            <p>3. Admin will reply with your activation key.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">Activation Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Enter Key" 
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--theme-color)] transition-colors"
                />
              </div>
              <button 
                onClick={handleActivate}
                className="btn-primary px-6 rounded-xl"
                style={{ backgroundColor: themeColor }}
              >
                Activate
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
