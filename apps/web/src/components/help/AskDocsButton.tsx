/**
 * AskDocsButton - Floating "Ask the Docs" button
 * Opens a modal to voice-query the documentation
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion, X, Mic, Send, Book, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AskDocsButtonProps {
  className?: string;
}

export default function AskDocsButton({ className }: AskDocsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    // Simulate AI response - in production, this would call the voice-docs AI
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on query
    const mockResponses: Record<string, string> = {
      'passcode': 'Your passcode is used to derive the encryption key for all your data. We never see it. If you lose it, your data is GONE FOREVER.',
      'data': 'All your data is stored locally in your browser using IndexedDB. You can export it anytime from Settings.',
      'gdpr': 'Go to Data Reclamation → GDPR Requests. We have templates for Google, Meta, Amazon, and 5 more platforms.',
      'lock': 'Click the Lock button in the sidebar to secure your session. You\'ll need your passcode to unlock.',
    };
    
    const lowerQuery = query.toLowerCase();
    let answer = 'I\'m here to help! Try asking about: passcode security, data storage, GDPR requests, or how to lock your session.';
    
    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerQuery.includes(key)) {
        answer = value;
        break;
      }
    }
    
    setResponse(answer);
    setIsLoading(false);
  };

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // In production, this would use the Web Speech API
      setTimeout(() => {
        setQuery('How does the passcode work?');
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform",
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Ask the Docs"
      >
        <MessageCircleQuestion className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Ask the Docs</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Voice or type your question</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 min-h-[200px]">
                {response ? (
                  <div className="space-y-4">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
                        {query}
                      </div>
                    </div>
                    
                    {/* AI Answer */}
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-2xl rounded-bl-md max-w-[80%]">
                        {response}
                      </div>
                    </div>

                    {/* Reset */}
                    <button
                      onClick={() => { setResponse(null); setQuery(''); }}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Ask another question
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {isLoading ? 'Thinking...' : 'What do you want to know?'}
                    </p>
                    
                    {isListening && (
                      <div className="flex items-center justify-center gap-2 text-red-500 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        Listening...
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center">
                      {['How do I lock?', 'GDPR requests', 'Data export'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setQuery(suggestion)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              {!response && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex gap-2">
                    <button
                      onClick={toggleListen}
                      className={cn(
                        "p-3 rounded-xl transition-colors",
                        isListening
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="Type your question..."
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!query.trim() || isLoading}
                      className="p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-4 pb-4">
                <a
                  href="/help"
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <ExternalLink className="w-4 h-4" />
                  View full documentation
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
