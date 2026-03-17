import { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import CreateBill from './components/CreateBill';
import BillHistory from './components/BillHistory';
import Game from './components/Game';
import Upgrade from './components/Upgrade';
import Settings from './components/Settings';
import PrivacyPolicy from './components/PrivacyPolicy';
import { motion, AnimatePresence } from 'motion/react';

export type Page = 'splash' | 'dashboard' | 'create' | 'history' | 'game' | 'upgrade' | 'settings' | 'privacy';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('splash');
  const themeColor = useAppStore(state => state.themeColor);
  const language = useAppStore(state => state.language);

  // Apply theme color to root
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, [themeColor]);

  // Apply language direction
  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    if (language === 'ur') {
      document.documentElement.classList.add('font-urdu');
    } else {
      document.documentElement.classList.remove('font-urdu');
    }
  }, [language]);

  const renderPage = () => {
    switch (currentPage) {
      case 'splash': return <Splash onStart={() => setCurrentPage('dashboard')} />;
      case 'dashboard': return <Dashboard onNavigate={(page) => {
        if (page === 'create') {
          useAppStore.getState().setEditingBill(null);
        }
        setCurrentPage(page);
      }} />;
      case 'create': return <CreateBill onBack={() => setCurrentPage('dashboard')} />;
      case 'history': return <BillHistory onBack={() => setCurrentPage('dashboard')} onEdit={() => setCurrentPage('create')} />;
      case 'game': return <Game onBack={() => setCurrentPage('dashboard')} onUpgrade={() => setCurrentPage('upgrade')} />;
      case 'upgrade': return <Upgrade onBack={() => setCurrentPage('dashboard')} />;
      case 'settings': return <Settings onBack={() => setCurrentPage('dashboard')} />;
      case 'privacy': return <PrivacyPolicy onBack={() => setCurrentPage('settings')} />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans selection:bg-[var(--theme-color)] selection:text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen w-full max-w-md mx-auto relative shadow-2xl shadow-[var(--theme-color)]/20 border-x border-white/5"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
