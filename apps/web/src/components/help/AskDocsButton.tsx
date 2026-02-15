/**
 * AskDocsButton - Floating "Ask the Docs" button
 * Uses Convex backend when configured, with fallback guidance otherwise.
 */
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion, X, Mic, Send, Book, ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  getVoiceDocsSectionFromPath,
  requestVoiceDocsResponse,
  type VoiceDocsResponse,
} from '@/services/voiceDocsService';

interface AskDocsButtonProps {
  className?: string;
}

const suggestionBySection: Record<string, string[]> = {
  dashboard: ['How do I start?', 'Where is Brain Dump?', 'How do insights work?'],
  journal: ['Create a new entry', 'Track mood and energy', 'Attach media to entries'],
  'brain-dump': ['Start recording', 'How synthesis works', 'Clarification questions'],
  settings: ['Export encrypted backup', 'Reset local data', 'Theme and storage options'],
  default: ['How do I lock?', 'GDPR requests', 'Data export'],
};

export default function AskDocsButton({ className }: AskDocsButtonProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMeta, setResponseMeta] = useState<VoiceDocsResponse | null>(null);

  const appSection = useMemo(
    () => getVoiceDocsSectionFromPath(location.pathname),
    [location.pathname]
  );
  const suggestions = suggestionBySection[appSection] ?? suggestionBySection.default;

  const handleSubmit = async (): Promise<void> => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setIsLoading(true);

    const result = await requestVoiceDocsResponse({
      question: trimmed,
      appSection,
    });

    setResponse(result.response);
    setResponseMeta(result);
    setIsLoading(false);
  };

  const toggleListen = (): void => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);

    setTimeout(() => {
      setQuery('What can I do on this page?');
      setIsListening(false);
    }, 1800);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        data-testid="ask-docs-toggle"
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg transition-transform hover:scale-110',
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Ask the Docs"
      >
        <MessageCircleQuestion className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Book className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Ask the Docs</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Context: {appSection}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="min-h-[200px] p-4">
                {response ? (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-purple-100 px-4 py-2 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100">
                        {query}
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-gray-900 dark:bg-gray-800 dark:text-white">
                        {response}
                      </div>
                    </div>

                    {responseMeta && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {responseMeta.cacheHit
                          ? 'Served from cache.'
                          : responseMeta.fallbackUsed
                            ? 'Fallback response used.'
                            : 'Generated from Voice Docs backend.'}
                      </p>
                    )}

                    <button
                      onClick={() => {
                        setResponse(null);
                        setResponseMeta(null);
                        setQuery('');
                      }}
                      className="text-sm text-purple-600 hover:underline dark:text-purple-400"
                    >
                      Ask another question
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      {isLoading ? 'Thinking...' : 'Ask about the current section.'}
                    </p>

                    {isListening && (
                      <div className="mb-4 flex items-center justify-center gap-2 text-red-500">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                        Listening...
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setQuery(suggestion)}
                          className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!response && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                  <div className="flex gap-2">
                    <button
                      onClick={toggleListen}
                      className={cn(
                        'rounded-xl p-3 transition-colors',
                        isListening
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                      )}
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && void handleSubmit()}
                      placeholder="Type your question..."
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() => void handleSubmit()}
                      disabled={!query.trim() || isLoading}
                      data-testid="ask-docs-send"
                      className="rounded-xl bg-purple-600 p-3 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="px-4 pb-4">
                <a
                  href="/help"
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                >
                  <ExternalLink className="h-4 w-4" />
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
