import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bill, Plan, CustomWatermark } from '../types';

interface AppState {
  plan: Plan;
  activationKey: string;
  bills: Bill[];
  themeColor: string;
  language: 'en' | 'ur';
  customWatermark: CustomWatermark;
  editingBill: Bill | null;
  
  setPlan: (plan: Plan) => void;
  setActivationKey: (key: string) => void;
  addBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
  updateBill: (id: string, bill: Bill) => void;
  setThemeColor: (color: string) => void;
  setLanguage: (lang: 'en' | 'ur') => void;
  setCustomWatermark: (watermark: CustomWatermark) => void;
  setEditingBill: (bill: Bill | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      plan: 'free',
      activationKey: '',
      bills: [],
      themeColor: '#3b82f6', // default blue
      language: 'en',
      customWatermark: { name: '', address: '', phone: '' },
      editingBill: null,
      
      setPlan: (plan) => set({ plan }),
      setActivationKey: (activationKey) => set({ activationKey }),
      addBill: (bill) => set((state) => ({ bills: [bill, ...state.bills] })),
      deleteBill: (id) => set((state) => ({ bills: state.bills.filter(b => b.id !== id) })),
      updateBill: (id, updatedBill) => set((state) => ({
        bills: state.bills.map(b => b.id === id ? updatedBill : b)
      })),
      setThemeColor: (themeColor) => set({ themeColor }),
      setLanguage: (language) => set({ language }),
      setCustomWatermark: (customWatermark) => set({ customWatermark }),
      setEditingBill: (editingBill) => set({ editingBill }),
    }),
    {
      name: 'bill-crown-3-storage',
    }
  )
);
