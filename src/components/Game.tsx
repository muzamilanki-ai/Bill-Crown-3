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

interface Cell {
  id: string;
  emoji: string;
  isBlasting: boolean;
}

export default function Game({ onBack, onUpgrade }: GameProps) {
  const { plan, themeColor } = useAppStore();
  const [mode, setMode] = useState<Mode>('fruits');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    const emojis = EMOJIS[mode];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        row.push({
          id: generateId(),
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          isBlasting: false
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setScore(0);
    setSelected(null);
    setIsProcessing(false);
  }, [mode]);

  useEffect(() => {
    if (plan !== 'free') {
      initializeGrid();
    }
  }, [mode, plan, initializeGrid]);

  const processMatches = async (currentGrid: Cell[][]): Promise<boolean> => {
    let matchFound = false;
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
    let points = 0;
    
    // Find matches
    // Horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const e1 = newGrid[r][c].emoji;
        const e2 = newGrid[r][c+1].emoji;
        const e3 = newGrid[r][c+2].emoji;
        if (e1 && e1 === e2 && e1 === e3) {
          matchFound = true;
          newGrid[r][c].isBlasting = true;
          newGrid[r][c+1].isBlasting = true;
          newGrid[r][c+2].isBlasting = true;
          points += 10;
        }
      }
    }
    
    // Vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        const e1 = newGrid[r][c].emoji;
        const e2 = newGrid[r+1][c].emoji;
        const e3 = newGrid[r+2][c].emoji;
        if (e1 && e1 === e2 && e1 === e3) {
          matchFound = true;
          newGrid[r][c].isBlasting = true;
          newGrid[r+1][c].isBlasting = true;
          newGrid[r+2][c].isBlasting = true;
          points += 10;
        }
      }
    }

    if (!matchFound) return false;

    setGrid(newGrid);
    setScore(s => s + points);

    // Wait for blast animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Apply gravity
    const emojis = EMOJIS[mode];
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptySpaces = 0;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (newGrid[r][c].isBlasting) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[r + emptySpaces][c] = newGrid[r][c];
        }
      }
      // Fill top
      for (let r = 0; r < emptySpaces; r++) {
        newGrid[r][c] = {
          id: generateId(),
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          isBlasting: false
        };
      }
    }

    setGrid([...newGrid]);
    
    // Check for cascading matches
    await new Promise(resolve => setTimeout(resolve, 300));
    await processMatches(newGrid);
    
    return true;
  };

  const handleCellClick = async (r: number, c: number) => {
    if (isProcessing) return;

    if (!selected) {
      setSelected({ r, c });
    } else {
      const isAdjacent = (Math.abs(selected.r - r) === 1 && selected.c === c) || (Math.abs(selected.c - c) === 1 && selected.r === r);
      if (isAdjacent) {
        setIsProcessing(true);
        const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
        
        // Swap
        const temp = newGrid[r][c];
        newGrid[r][c] = newGrid[selected.r][selected.c];
        newGrid[selected.r][selected.c] = temp;
        setGrid(newGrid);
        setSelected(null);

        // Wait for swap animation
        await new Promise(resolve => setTimeout(resolve, 200));

        const matched = await processMatches(newGrid);
        
        if (!matched) {
          // Swap back
          const revertGrid = newGrid.map(row => row.map(cell => ({ ...cell })));
          const tempBack = revertGrid[r][c];
          revertGrid[r][c] = revertGrid[selected.r][selected.c];
          revertGrid[selected.r][selected.c] = tempBack;
          setGrid(revertGrid);
        }
        setIsProcessing(false);
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
          <p className="text-white/50 mb-8 max-w-[250px]">Upgrade to Pro or Premium to unlock the mini game and earn points!</p>
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
              row.map((cell, c) => (
                <motion.button
                  key={cell.id}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: cell.isBlasting ? 0 : 1,
                    rotate: cell.isBlasting ? 180 : 0,
                    opacity: cell.isBlasting ? 0 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl rounded-xl transition-colors ${selected?.r === r && selected?.c === c ? 'bg-white/20 ring-2 ring-white' : 'bg-black/30 hover:bg-white/10'}`}
                >
                  {cell.emoji}
                </motion.button>
              ))
            ))}
          </div>
        </div>
        <p className="text-white/50 text-xs mt-6 text-center">Click two adjacent items to swap them.</p>
      </main>
    </div>
  );
}
