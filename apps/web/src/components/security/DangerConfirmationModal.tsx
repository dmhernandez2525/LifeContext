import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DangerConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
}

export default function DangerConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Danger Zone",
  message = "Are you sure you want to proceed?",
  confirmText = "DELETE"
}: DangerConfirmationModalProps) {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [inputConfirmation, setInputConfirmation] = useState('');
  
  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCheck1(false);
      setCheck2(false);
      setInputConfirmation('');
    }
  }, [isOpen]);

  const canConfirm = check1 && check2 && inputConfirmation === confirmText;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-200 dark:border-red-900/50">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-lg font-bold text-red-900 dark:text-red-100">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <X className="w-5 h-5 text-red-700 dark:text-red-300" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {message}
                </p>

                <div className="space-y-4 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={check1}
                        onChange={(e) => setCheck1(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-red-300 dark:border-red-700 rounded bg-white dark:bg-gray-800 peer-checked:bg-red-600 peer-checked:border-red-600 transition-colors" />
                      <Check className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm font-medium text-red-900 dark:text-red-200 group-hover:text-red-700 dark:group-hover:text-red-100 transition-colors">
                      I understand that this action cannot be undone.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={check2}
                        onChange={(e) => setCheck2(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-red-300 dark:border-red-700 rounded bg-white dark:bg-gray-800 peer-checked:bg-red-600 peer-checked:border-red-600 transition-colors" />
                      <Check className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm font-medium text-red-900 dark:text-red-200 group-hover:text-red-700 dark:group-hover:text-red-100 transition-colors">
                      I understand that my data will be permanently deleted.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type <span className="font-mono font-bold text-red-600 dark:text-red-400">{confirmText}</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={inputConfirmation}
                    onChange={(e) => setInputConfirmation(e.target.value)}
                    placeholder={confirmText}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all",
                    canConfirm
                      ? "bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/25"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
