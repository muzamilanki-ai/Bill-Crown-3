import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Crown } from 'lucide-react';

interface SplashProps {
  onStart: () => void;
}

export default function Splash({ onStart }: SplashProps) {
  const themeColor = useAppStore(state => state.themeColor);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-30"
        style={{ backgroundColor: themeColor }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div 
          className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8 glow-box glass-panel"
        >
          <Crown size={64} style={{ color: themeColor }} />
        </div>
        
        <h1 className="text-5xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
          BILL CROWN <span style={{ color: themeColor }}>3</span>
        </h1>
        <p className="text-white/50 font-medium tracking-widest uppercase text-sm mb-16">
          Futuristic Generator
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="btn-primary w-full max-w-xs text-lg py-4 rounded-2xl relative overflow-hidden group"
          style={{ backgroundColor: themeColor }}
        >
          <span className="relative z-10">START</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </motion.button>
      </motion.div>
    </div>
  );
}
