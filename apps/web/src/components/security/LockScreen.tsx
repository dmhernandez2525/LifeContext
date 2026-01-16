/**
 * LockScreen - Displayed when the app is locked
 * User must enter passcode to unlock
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { hashPasscode } from '@lcc/encryption';

// Storage key for security credentials (same as RegisterPage)
const SECURITY_STORAGE_KEY = 'lcc-security';

interface SecurityData {
  salt: string;
  hash: string;
  createdAt: string;
}

export default function LockScreen() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);
  const unlock = useAppStore((state) => state.unlock);

  // Check if user has an account on mount
  useEffect(() => {
    const storedData = localStorage.getItem(SECURITY_STORAGE_KEY);
    if (!storedData) {
      setHasAccount(false);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passcode.length < 6) {
      setError('Passcode must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Get stored security data
      const storedData = localStorage.getItem(SECURITY_STORAGE_KEY);

      if (!storedData) {
        // No security data found - redirect to register
        navigate('/register');
        return;
      }

      const securityData: SecurityData = JSON.parse(storedData);

      // Hash the entered passcode with the stored salt
      const enteredHash = await hashPasscode(passcode, securityData.salt);

      // Compare hashes
      if (enteredHash === securityData.hash) {
        // Passcode is correct - unlock the app
        unlock();
      } else {
        setError('Incorrect passcode. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify passcode. Please try again.');
      console.error('Passcode verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  // If no account exists, show a different UI prompting registration
  if (!hasAccount) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
        <div className="p-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center text-white/70 hover:text-white transition-colors min-h-[44px] px-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to LifeContext
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              Set up your secure passcode to get started with your personal life context compiler.
            </p>

            <button
              onClick={handleGoToRegister}
              className="w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-[1.02] transition-all min-h-[48px]"
            >
              Set Up Passcode
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Back button */}
      <div className="p-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center text-white/70 hover:text-white transition-colors min-h-[44px] px-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl"
        >
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            LifeContext Locked
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-6 sm:mb-8">
            Enter your passcode to unlock your life context
          </p>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className={cn(
                  "w-full px-4 py-3 sm:py-4 pr-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-base sm:text-lg tracking-wider transition-colors",
                  error ? "border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-purple-500"
                )}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
              >
                {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={!passcode || isLoading}
              className={cn(
                "w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all min-h-[48px]",
                passcode && !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-[1.02]"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Unlock'
              )}
            </button>
          </form>

          {/* Warning */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
            Your data is encrypted with this passcode. If you've forgotten it,
            your data cannot be recovered.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
