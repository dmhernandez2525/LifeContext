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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { initialize } = useAppStore();
  
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: Passcode

  const handleInitialize = (e: React.FormEvent) => {
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

    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-purple-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Initialize Your Essence</h1>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Life Context Compiler uses **Zero-Server Security**. 
                Your data never leaves your device unencrypted. To begin, you'll create a 
                Master Passcode that acts as the key to your digital legacy.
              </p>

              <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold mb-2">Local-First Encryption</h3>
                  <p className="text-sm text-gray-500">All information is hashed on your device. We can't see it, even if we wanted to.</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Key className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-bold mb-2">Immutable Identity</h3>
                  <p className="text-sm text-gray-500">Your passcode is the salt for your data. It's the only way to unlock your context.</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center space-x-2 bg-white text-black px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all"
              >
                <span>Continue to Security Setup</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <Lock className="w-24 h-24 text-white/5" />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Set Your Master Passcode</h2>
                <p className="text-gray-400 mb-8">This is your ONLY key. We cannot reset it.</p>

                <form onSubmit={handleInitialize} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-widest">
                      New Passcode
                    </label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
                      placeholder="Enter a strong passcode"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-widest">
                      Confirm Passcode
                    </label>
                    <input
                      type="password"
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700"
                      placeholder="Repeat your passcode"
                    />
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center font-medium"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex gap-4">
                    <Info className="w-6 h-6 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-200/80 leading-relaxed">
                      LCC uses a zero-knowledge architecture. This means your passcode is never 
                      sent to any server. If you lose this passcode, your compiled life context 
                      will be **permanently unrecoverable**.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-8 py-5 rounded-2xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all order-2 sm:order-1"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] px-8 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl order-1 sm:order-2"
                    >
                      Complete Setup
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-600 text-sm">
        Built with extreme privacy. Your data, your rules.
      </footer>
    </div>
  );
}
