import { AnimatePresence, motion } from 'framer-motion';
import { Book, Command, ExternalLink, Mic, Minimize2, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import HelpHistoryPanel from './HelpHistoryPanel';
import HelpNpsPrompt from './HelpNpsPrompt';
import HelpResponseFeedback from './HelpResponseFeedback';
import { HELP_QUICK_ACTIONS } from './helpQuickActions';
import type { HelpHistoryItem, WalkthroughDefinition } from './helpTypes';
import type { HelpFeedbackValue, HelpQuickAction } from './helpUxTypes';
import type { VoiceDocsResponse } from '@/services/voiceDocsService';

interface WalkthroughQuickAction {
  id: string;
  label: string;
}

interface HelpAssistantModalProps {
  isOpen: boolean;
  isDark: boolean;
  appSection: string;
  breadcrumbs: string[];
  discoveryPrompt: string | null;
  suggestions: string[];
  query: string;
  response: string | null;
  responseMeta: VoiceDocsResponse | null;
  responseKey: string;
  history: HelpHistoryItem[];
  isLoading: boolean;
  isListening: boolean;
  interimTranscript: string;
  speechError: string | null;
  showNpsPrompt: boolean;
  setQuery: (value: string) => void;
  onClose: () => void;
  onOpenPalette: () => void;
  onToggleMinimize: () => void;
  onSubmit: () => Promise<void>;
  onToggleVoiceInput: () => void;
  onQuickAction: (action: HelpQuickAction) => void;
  onWalkthroughQuickAction: (actionId: string) => void;
  onFeedbackSubmit: (value: HelpFeedbackValue) => void;
  onNpsRate: (score: number) => void;
  onNpsDismiss: () => void;
  onHistorySelect: (item: HelpHistoryItem) => void;
  onHistoryClear: () => void;
  walkthroughQuickActions: WalkthroughQuickAction[];
}

const springTransition = { type: 'spring', stiffness: 320, damping: 28, mass: 0.7 } as const;

export default function HelpAssistantModal({
  isOpen,
  isDark,
  appSection,
  breadcrumbs,
  discoveryPrompt,
  suggestions,
  query,
  response,
  responseMeta,
  responseKey,
  history,
  isLoading,
  isListening,
  interimTranscript,
  speechError,
  showNpsPrompt,
  setQuery,
  onClose,
  onOpenPalette,
  onToggleMinimize,
  onSubmit,
  onToggleVoiceInput,
  onQuickAction,
  onWalkthroughQuickAction,
  onFeedbackSubmit,
  onNpsRate,
  onNpsDismiss,
  onHistorySelect,
  onHistoryClear,
  walkthroughQuickActions,
}: HelpAssistantModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={springTransition}
            data-testid="ask-docs-modal"
            data-theme-mode={isDark ? 'dark' : 'light'}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Book className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Ask the Docs</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Context: {breadcrumbs.join(' > ') || appSection}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={onOpenPalette} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Open command palette">
                  <Command className="h-4 w-4 text-gray-500" />
                </button>
                <button type="button" onClick={onToggleMinimize} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Minimize help">
                  <Minimize2 className="h-4 w-4 text-gray-500" />
                </button>
                <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-4">
              {discoveryPrompt && <div className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-200">{discoveryPrompt}</div>}

              <div className="grid grid-cols-2 gap-2" data-testid="help-quick-actions">
                {HELP_QUICK_ACTIONS.map((action) => (
                  <button key={action.id} data-testid={`help-quick-action-${action.id}`} type="button" onClick={() => onQuickAction(action)} className="rounded-lg border border-gray-200 px-2.5 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    <p className="font-semibold">{action.label}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{action.description}</p>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setQuery(suggestion)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {walkthroughQuickActions.map((action) => (
                  <button key={action.id} type="button" onClick={() => onWalkthroughQuickAction(action.id)} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    {action.label}
                  </button>
                ))}
              </div>

              {response && (
                <div className="rounded-xl bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                  <p>{response}</p>
                  {responseMeta && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {responseMeta.cacheHit ? 'Served from cache.' : responseMeta.fallbackUsed ? 'Fallback response used.' : 'Response generated for current context.'}
                    </p>
                  )}
                  <HelpResponseFeedback responseKey={responseKey} onSubmit={onFeedbackSubmit} />
                </div>
              )}

              <HelpNpsPrompt isOpen={showNpsPrompt} onDismiss={onNpsDismiss} onRate={onNpsRate} />

              <div data-help-history>
                <HelpHistoryPanel history={history.slice(0, 6)} onSelect={onHistorySelect} onClear={onHistoryClear} />
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="ask-docs-voice-toggle"
                  onClick={onToggleVoiceInput}
                  className={cn('rounded-xl p-3', isListening ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700')}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  data-help-input="true"
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && void onSubmit()}
                  placeholder="Try: take me to journal, show me how to export backup"
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button type="button" onClick={() => void onSubmit()} disabled={!query.trim() || isLoading} data-testid="ask-docs-send" className="rounded-xl bg-purple-600 p-3 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <Send className="h-5 w-5" />
                </button>
              </div>

              {isListening && (
                <p data-testid="ask-docs-noise-hint" className="mt-2 text-xs text-red-600 dark:text-red-300">
                  Listening... {interimTranscript ? `Heard: \"${interimTranscript}\". ` : ''}Tip: move to a quieter place and speak clearly.
                </p>
              )}
              {speechError && <p className="mt-2 text-xs text-amber-600 dark:text-amber-300">{speechError}</p>}

              <a href="/help" className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                <ExternalLink className="h-4 w-4" />
                View full documentation
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
