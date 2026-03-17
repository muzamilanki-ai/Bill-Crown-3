import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Gamepad2, Lock, Star } from 'lucide-react';

interface GameProps {
  onBack: () => void;
  onUpgrade: () => void;
}

type Mode = 'fruits' | 'food' | 'money';

const EMOJIS = {
  fruits: ['🍎', '🍌', '🍇', '🍉', '🍓'],
  food: ['🍔', '🍕', '🍟', '🌭', '🍩'],
  money: ['💵', '💰', '💳', '🪙', '💎'],
};

const GRID_SIZE = 6;

export default function Game({ onBack, onUpgrade }: GameProps) {
  const { plan, themeColor } = useAppStore();
  const [mode, setMode] = useState<Mode>('fruits');
  const [grid, setGrid] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);

  const initializeGrid = useCallback(() => {
    const newGrid: string[][] = [];
    const emojis = EMOJIS[mode];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: string[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        row.push(emojis[Math.floor(Math.random() * emojis.length)]);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setScore(0);
  }, [mode]);

  useEffect(() => {
    if (plan !== 'free') {
      initializeGrid();
    }
  }, [mode, plan, initializeGrid]);

  const handleCellClick = (r: number, c: number) => {
    if (!selected) {
      setSelected({ r, c });
    } else {
      const isAdjacent = (Math.abs(selected.r - r) === 1 && selected.c === c) || (Math.abs(selected.c - c) === 1 && selected.r === r);
      if (isAdjacent) {
        const newGrid = grid.map(row => [...row]);
        const temp = newGrid[r][c];
        newGrid[r][c] = newGrid[selected.r][selected.c];
        newGrid[selected.r][selected.c] = temp;
        
        // Simple check for match after swap
        let matchFound = false;
        let points = 0;
        
        // Horizontal
        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE - 2; j++) {
            if (newGrid[i][j] && newGrid[i][j] === newGrid[i][j+1] && newGrid[i][j] === newGrid[i][j+2]) {
              matchFound = true;
              points += 10;
              newGrid[i][j] = '';
              newGrid[i][j+1] = '';
              newGrid[i][j+2] = '';
            }
          }
        }
        
        // Vertical
        for (let j = 0; j < GRID_SIZE; j++) {
          for (let i = 0; i < GRID_SIZE - 2; i++) {
            if (newGrid[i][j] && newGrid[i][j] === newGrid[i+1][j] && newGrid[i][j] === newGrid[i+2][j]) {
              matchFound = true;
              points += 10;
              newGrid[i][j] = '';
              newGrid[i+1][j] = '';
              newGrid[i+2][j] = '';
            }
          }
        }

        if (matchFound) {
          setScore(s => s + points);
          // Refill empty spots
          const emojis = EMOJIS[mode];
          for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
              if (newGrid[i][j] === '') {
                newGrid[i][j] = emojis[Math.floor(Math.random() * emojis.length)];
              }
            }
          }
        } else {
          // Swap back if no match
          const tempBack = newGrid[r][c];
          newGrid[r][c] = newGrid[selected.r][selected.c];
          newGrid[selected.r][selected.c] = tempBack;
        }

        setGrid(newGrid);
        setSelected(null);
      } else {
        setSelected({ r, c });
      }
    }
  };

  if (plan === 'free') {
    return (
      <div className="min-h-screen flex flex-col pb-24">
        <header className="p-4 flex items-center justify-between glass-panel sticky top-0 z-50">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="font-bold text-lg">Mini Game</h2>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center glow-box bg-black/50 mb-6">
            <Lock size={48} className="text-white/50" />
          </div>
          <h2 className="text-3xl font-black mb-2">Game Locked</h2>
          <p className="text-white/50 mb-8 max-w-[250px]">Upgrade your plan to unlock the mini game and earn points!</p>
          <button 
            onClick={onUpgrade}
            className="btn-primary w-full max-w-xs py-4 rounded-2xl text-lg"
            style={{ backgroundColor: themeColor }}
          >
            Upgrade Now
          </button>
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
        <div className="flex items-center gap-2 font-bold text-lg">
          <Star size={20} style={{ color: themeColor }} /> {score}
        </div>
        <button onClick={initializeGrid} className="p-2 rounded-full hover:bg-white/10 text-xs font-bold">
          RESET
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="flex gap-2 mb-8 bg-black/50 p-1 rounded-xl glass-panel">
          <button 
            onClick={() => setMode('fruits')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'fruits' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
          >
            Fruits
          </button>
          <button 
            onClick={() => setMode('food')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'food' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
          >
            Food
          </button>
          <button 
            onClick={() => plan === 'premium' ? setMode('money') : onUpgrade()}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${mode === 'money' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
          >
            Money {plan !== 'premium' && <Lock size={12} />}
          </button>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-white/10 glow-box relative">
          <div className="grid grid-cols-6 gap-2">
            {grid.map((row, r) => (
              row.map((emoji, c) => (
                <motion.button
                  key={`${r}-${c}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl rounded-xl transition-colors ${selected?.r === r && selected?.c === c ? 'bg-white/20 ring-2 ring-white' : 'bg-black/30 hover:bg-white/10'}`}
                >
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`${r}-${c}-${emoji}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {emoji}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              ))
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
