/**
 * LockScreen - Displayed when the app is locked
 * User must enter passcode to unlock
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';

export default function LockScreen() {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const unlock = useAppStore((state) => state.unlock);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate passcode verification
    // In production, this would derive the key and verify it can decrypt data
    await new Promise(resolve => setTimeout(resolve, 500));

    if (passcode.length >= 6) {
      // Store the passcode hash for this session
      // In production: derive encryption key from passcode
      unlock();
    } else {
      setError('Passcode must be at least 6 characters');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-8 shadow-2xl"
      >
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          LifeContext Locked
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
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
                "w-full px-4 py-4 pr-12 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-lg tracking-wider transition-colors",
                error ? "border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-purple-500"
              )}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={!passcode || isLoading}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all",
              passcode && !isLoading
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-[1.02]"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Unlocking...
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
  );
}
