import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Palette, Globe, Shield, Heart, Mail } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  const { themeColor, setThemeColor, language, setLanguage, plan, customWatermark, setCustomWatermark } = useAppStore();
  const { t } = useTranslation();

  const colors = [
    '#3b82f6', // blue
    '#ec4899', // pink
    '#8b5cf6', // purple
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="p-4 flex items-center justify-between glass-panel sticky top-0 z-50">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-lg">{t('settings')}</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Palette size={20} style={{ color: themeColor }} /> {t('themeColor')}
          </h3>
          <div className="flex gap-3 flex-wrap">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`w-10 h-10 rounded-full transition-transform ${themeColor === color ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-105'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Globe size={20} style={{ color: themeColor }} /> {t('language')}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-3 rounded-xl font-bold transition-colors ${language === 'en' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {t('english')}
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`flex-1 py-3 rounded-xl font-bold font-urdu transition-colors ${language === 'ur' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {t('urdu')}
            </button>
          </div>
        </div>

        {plan === 'premium' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield size={20} style={{ color: themeColor }} /> {t('watermark')}
            </h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder={t('watermarkName')} 
                value={customWatermark.name}
                onChange={e => setCustomWatermark({ ...customWatermark, name: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--theme-color)] transition-colors"
              />
              <input 
                type="text" 
                placeholder={t('watermarkPhone')} 
                value={customWatermark.phone}
                onChange={e => setCustomWatermark({ ...customWatermark, phone: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--theme-color)] transition-colors"
              />
              <input 
                type="text" 
                placeholder="Address" 
                value={customWatermark.address}
                onChange={e => setCustomWatermark({ ...customWatermark, address: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--theme-color)] transition-colors"
              />
            </div>
          </div>
        )}

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <button 
            onClick={() => window.location.href = 'mailto:muzamilanki@gmail.com'}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-bold">Contact Support</h4>
              <p className="text-xs text-white/50">muzamilanki@gmail.com</p>
            </div>
          </button>

          <button 
            onClick={() => alert('Donate via EasyPaisa: 03349825814')}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Heart size={20} className="text-pink-500" />
            </div>
            <div>
              <h4 className="font-bold">Donate</h4>
              <p className="text-xs text-white/50">Support the developer</p>
            </div>
          </button>

          <button 
            onClick={() => window.open('https://sites.google.com/view/muzamilproduction', '_blank')}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Shield size={20} className="text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold">Developer Policy</h4>
              <p className="text-xs text-white/50">See developer policy</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
