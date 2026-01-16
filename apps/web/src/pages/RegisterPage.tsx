import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Key,
  Info
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { generateSalt, hashPasscode } from '@lcc/encryption';

// Storage key for security credentials
const SECURITY_STORAGE_KEY = 'lcc-security';

interface RegisterPageProps {
  onRegistered?: () => void;
}

export default function RegisterPage({ onRegistered }: RegisterPageProps) {
  const navigate = useNavigate();
  const { initialize, unlock } = useAppStore();

  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Passcode

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passcode.length < 6) {
      setError('Passcode must be at least 6 characters');
      return;
    }
    if (passcode !== confirmPasscode) {
      setError('Passcodes do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Generate salt and hash passcode
      const salt = generateSalt();
      const hash = await hashPasscode(passcode, salt);

      // Store security credentials (hash + salt, NOT the passcode)
      const securityData = {
        salt,
        hash,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(securityData));

      // Initialize app with settings
      initialize({
        preferredInputMethod: 'voice',
        theme: 'system',
        language: 'en',
        showLiveTranscription: false,
        aiProvider: {
          mode: 'cloud',
          cloudProvider: 'anthropic',
          useDefaultKey: true,
        },
        storage: {
          location: 'local',
          autoBackup: false,
          backupFrequency: 'daily',
        },
      });

      // Unlock the app (user just set their passcode, so they're authenticated)
      unlock();

      // Notify parent that registration is complete
      if (onRegistered) {
        onRegistered();
      }

      navigate('/app');
    } catch (err) {
      setError('Failed to initialize security. Please try again.');
      console.error('Security initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors min-h-[44px]">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Initialize Your Essence</h1>
              <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-12 leading-relaxed">
                Life Context Compiler uses **Zero-Server Security**.
                Your data never leaves your device unencrypted. To begin, you'll create a
                Master Passcode that acts as the key to your digital legacy.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-left mb-8 sm:mb-12">
                <div className="bg-white/5 border border-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Local-First Encryption</h3>
                  <p className="text-xs sm:text-sm text-gray-500">All information is hashed on your device. We can't see it, even if we wanted to.</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-500/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>
                  <h3 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Immutable Identity</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Your passcode is the salt for your data. It's the only way to unlock your context.</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:scale-105 transition-all"
              >
                <span>Continue to Security Setup</span>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-white/10 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 sm:p-8">
                <Lock className="w-16 h-16 sm:w-24 sm:h-24 text-white/5" />
              </div>

              <div className="relative z-10">
                <h2 className="text-xl sm:text-3xl font-bold mb-2">Set Your Master Passcode</h2>
                <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">This is your ONLY key. We cannot reset it.</p>

                <form onSubmit={handleInitialize} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-2 uppercase tracking-widest">
                      New Passcode
                    </label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white text-base sm:text-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
                      placeholder="Enter a strong passcode"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-2 uppercase tracking-widest">
                      Confirm Passcode
                    </label>
                    <input
                      type="password"
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      className="w-full px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-white text-base sm:text-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
                      placeholder="Repeat your passcode"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-xl text-center font-medium text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex gap-3 sm:gap-4">
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
                      LCC uses a zero-knowledge architecture. This means your passcode is never
                      sent to any server. If you lose this passcode, your compiled life context
                      will be **permanently unrecoverable**.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all order-2 sm:order-1 min-h-[52px]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-[2] px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-white text-black font-bold text-base sm:text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl order-1 sm:order-2 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Securing...
                        </span>
                      ) : (
                        'Complete Setup'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 sm:p-8 text-center text-gray-600 text-xs sm:text-sm" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        Built with extreme privacy. Your data, your rules.
      </footer>
    </div>
  );
}
