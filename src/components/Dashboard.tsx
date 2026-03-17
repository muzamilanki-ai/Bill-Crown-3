import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Page } from '../App';
import { Crown, Settings, FileText, History, Gamepad2, Plus, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { plan, themeColor } = useAppStore();

  const menuItems = [
    { id: 'create', title: 'Create Bill', icon: Plus, color: themeColor, desc: 'Generate new invoice' },
    { id: 'history', title: 'Bill History', icon: History, color: '#a855f7', desc: 'View saved bills' },
    { id: 'game', title: 'Mini Game', icon: Gamepad2, color: '#ec4899', desc: 'Play & earn points', locked: plan === 'free' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 z-50 glass-panel border-b-0 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-box bg-black/50">
            <Crown size={20} style={{ color: themeColor }} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Bill Crown 3</h1>
            <p className="text-xs text-white/50 capitalize font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
              {plan === 'free' ? 'Unpro' : plan} Plan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('upgrade')}
            className="w-10 h-10 rounded-xl flex items-center justify-center glass-panel hover:bg-white/10 transition-colors"
          >
            <Zap size={20} className="text-yellow-400" />
          </button>
          <button 
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 rounded-xl flex items-center justify-center glass-panel hover:bg-white/10 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col gap-4">
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 glass-panel border border-white/10"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[50px] opacity-30" style={{ backgroundColor: themeColor }} />
          <h2 className="text-2xl font-bold mb-2">Ready to generate?</h2>
          <p className="text-white/60 text-sm mb-6 max-w-[200px]">Create professional bills in seconds with our futuristic tool.</p>
          <button 
            onClick={() => onNavigate('create')}
            className="btn-primary text-sm px-6 py-2.5 rounded-xl"
            style={{ backgroundColor: themeColor }}
          >
            Start Now
          </button>
        </motion.div>

        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mt-4 mb-2">Quick Access</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(item.locked ? 'upgrade' : item.id as Page)}
              className="flex items-center gap-4 p-4 rounded-2xl glass-panel hover:bg-white/5 transition-all text-left relative overflow-hidden group"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                <item.icon size={24} />
              </div>
              <div className="flex-1 relative z-10">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {item.title}
                  {item.locked && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/70">PRO</span>}
                </h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
              
              {/* Hover glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${item.color})` }}
              />
            </motion.button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-white/30 mt-auto">
        <p>Created By Muzamil</p>
        <p className="mt-1">Bill Crown 3 &copy; 2026</p>
      </footer>
    </div>
  );
}
