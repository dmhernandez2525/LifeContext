/**
 * PasscodeConfirmation - Component requiring user to type confirmation phrase
 * to acknowledge they understand the zero-knowledge architecture.
 */
import { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONFIRMATION_PHRASE = 'I understand I cannot get this back';

interface PasscodeConfirmationProps {
  onConfirmed: () => void;
  onCancel?: () => void;
}

export default function PasscodeConfirmation({ 
  onConfirmed, 
  onCancel 
}: PasscodeConfirmationProps) {
  const [input, setInput] = useState('');
  const [hasAttempted, setHasAttempted] = useState(false);

  const isMatch = input.toLowerCase().trim() === CONFIRMATION_PHRASE.toLowerCase();
  const showError = hasAttempted && !isMatch && input.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttempted(true);
    
    if (isMatch) {
      onConfirmed();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Critical Security Notice
        </h2>

        {/* Warning Message */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed">
            <strong>LifeContext uses Zero-Knowledge Architecture.</strong>
          </p>
          <p className="text-red-700 dark:text-red-300 text-sm mt-2 leading-relaxed">
            Your passcode is <strong>NEVER</strong> sent to any server. If you lose this passcode, 
            your compiled life context will be <strong>permanently unrecoverable</strong>. 
            Not even we can help you.
          </p>
        </div>

        {/* Instructions */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center">
          To continue, please type the following phrase exactly:
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4 text-center">
          <code className="text-lg font-mono text-gray-900 dark:text-white">
            {CONFIRMATION_PHRASE}
          </code>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type the phrase above..."
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors",
                isMatch && "border-green-500 bg-green-50 dark:bg-green-900/20",
                showError && "border-red-500 bg-red-50 dark:bg-red-900/20",
                !isMatch && !showError && "border-gray-200 dark:border-gray-700"
              )}
              autoFocus
            />
            {isMatch && (
              <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
            )}
            {showError && (
              <X className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
            )}
          </div>

          {showError && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-4 text-center">
              Phrase doesn't match. Please type it exactly as shown.
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!isMatch}
              className={cn(
                "flex-1 px-6 py-3 rounded-xl font-bold transition-all",
                isMatch
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              I Confirm
            </button>
          </div>
        </form>

        {/* Fine Print */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
          This action cannot be undone. Make sure you save your passcode securely.
        </p>
      </div>
    </div>
  );
}
