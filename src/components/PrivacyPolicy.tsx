import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const themeColor = useAppStore(state => state.themeColor);

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="p-4 flex items-center justify-between glass-panel sticky top-0 z-50">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-lg">Privacy Policy</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 space-y-6 text-sm text-white/80 leading-relaxed">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center glow-box bg-black/50 mb-4">
            <ShieldCheck size={32} style={{ color: themeColor }} />
          </div>
          <h2 className="text-2xl font-bold">Data Safety & Privacy</h2>
          <p className="text-white/50 text-xs mt-2">Last updated: March 2026</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-bold text-lg text-white">1. Local Data Storage</h3>
          <p>
            Bill Crown 3 is designed with a privacy-first approach. All data generated, including bills, customer information, and settings, is stored <strong>locally</strong> on your device using LocalStorage and IndexedDB technologies.
          </p>

          <h3 className="font-bold text-lg text-white mt-6">2. No Server Storage</h3>
          <p>
            We do not use any external servers or cloud databases (such as Supabase, Firebase, or AWS) to store your personal data. Your invoices never leave your device unless you explicitly share or download them.
          </p>

          <h3 className="font-bold text-lg text-white mt-6">3. User Data Safety</h3>
          <p>
            Because your data is stored locally, it is completely safe from external data breaches. However, this also means that if you clear your browser data or uninstall the application, your bills will be permanently deleted unless you have downloaded them.
          </p>

          <h3 className="font-bold text-lg text-white mt-6">4. No Data Sharing</h3>
          <p>
            We do not collect, sell, or share your personal information with any third parties. The application operates entirely offline once loaded, ensuring maximum privacy.
          </p>

          <h3 className="font-bold text-lg text-white mt-6">5. User Control</h3>
          <p>
            You have full control over your data. You can view, edit, or delete any bill from the Bill History section. Deleting a bill removes it permanently from your device's local storage.
          </p>

          <h3 className="font-bold text-lg text-white mt-6">6. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: <br/>
            <a href="mailto:muzamilanki@gmail.com" className="font-bold" style={{ color: themeColor }}>muzamilanki@gmail.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}
