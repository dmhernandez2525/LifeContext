import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleQuestion, X, Mic, Send, Book, ExternalLink, Command } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { clearHelpHistory, getHelpHistory, saveHelpHistoryItem } from './helpHistory';
import { resolveDeepLinkSearch } from './helpDeepLink';
import {
  findNavigationTarget,
  getBreadcrumbs,
  getContextualSuggestions,
  parseCommand,
} from './helpNavigation';
import HelpCommandPalette from './HelpCommandPalette';
import HelpHistoryPanel from './HelpHistoryPanel';
import HelpWalkthroughOverlay from './HelpWalkthroughOverlay';
import { findWalkthrough, WALKTHROUGHS } from './helpWalkthroughs';
import { getVoiceDocsSectionFromPath, requestVoiceDocsResponse, type VoiceDocsResponse } from '@/services/voiceDocsService';
import type { HelpHistoryItem, WalkthroughDefinition } from './helpTypes';

interface AskDocsButtonProps {
  className?: string;
}

const discoveryBySection: Record<string, string> = {
  dashboard: 'Discovery: try "take me to journal" to navigate hands-free.',
  journal: 'Discovery: try "find entries about work" to jump by context.',
  'brain-dump': 'Discovery: try "show me how brain dump works" for a guided walkthrough.',
  settings: 'Discovery: try "show me how to export backup" for step-by-step guidance.',
  help: 'Discovery: try "take me to roadmap" to navigate public docs faster.',
  roadmap: 'Discovery: try "take me to feature request" to share roadmap feedback.',
  default: 'Discovery: press Ctrl+/ or Cmd+/ anywhere to open help instantly.',
};

const walkthroughQuickActions: Array<{ id: string; label: string }> = [
  { id: 'new-entry', label: 'Show me how: New entry' },
  { id: 'brain-dump', label: 'Show me how: Brain Dump' },
  { id: 'search', label: 'Show me how: Search' },
  { id: 'settings', label: 'Show me how: Settings' },
  { id: 'help-basics', label: 'Show me how: Help commands' },
];

export default function AskDocsButton({ className }: AskDocsButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMeta, setResponseMeta] = useState<VoiceDocsResponse | null>(null);
  const [history, setHistory] = useState<HelpHistoryItem[]>(() => getHelpHistory());
  const [activeWalkthrough, setActiveWalkthrough] = useState<WalkthroughDefinition | null>(null);
  const [walkthroughStepIndex, setWalkthroughStepIndex] = useState(0);
  const [discoveryPrompt, setDiscoveryPrompt] = useState<string | null>(null);

  const appSection = useMemo(
    () => getVoiceDocsSectionFromPath(location.pathname),
    [location.pathname]
  );
  const breadcrumbs = useMemo(() => getBreadcrumbs(location.pathname), [location.pathname]);
  const suggestions = useMemo(
    () => getContextualSuggestions(appSection, breadcrumbs).slice(0, 4),
    [appSection, breadcrumbs]
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setDiscoveryPrompt(null);
      return;
    }

    const seenKey = `lcc-help-discovery-seen-${appSection}`;
    const hasSeen = localStorage.getItem(seenKey) === 'true';

    if (!hasSeen) {
      setDiscoveryPrompt(discoveryBySection[appSection] ?? discoveryBySection.default);
      localStorage.setItem(seenKey, 'true');
      return;
    }

    setDiscoveryPrompt(null);
  }, [appSection, isOpen]);

  useEffect(() => {
    if (!activeWalkthrough) {
      return;
    }

    const step = activeWalkthrough.steps[walkthroughStepIndex];
    if (step?.path && location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [activeWalkthrough, walkthroughStepIndex, navigate, location.pathname]);

  const saveHistoryEntry = (requestQuery: string, answer: string): void => {
    const entry = saveHelpHistoryItem({
      query: requestQuery,
      response: answer,
      appSection,
      breadcrumbs,
    });

    setHistory((previous) => [entry, ...previous].slice(0, 30));
  };

  const handleWalkthroughStart = (walkthroughIdOrQuery: string): void => {
    const found = WALKTHROUGHS.find((item) => item.id === walkthroughIdOrQuery) ?? findWalkthrough(walkthroughIdOrQuery);
    if (!found) {
      return;
    }

    setActiveWalkthrough(found);
    setWalkthroughStepIndex(0);
    setResponse(`Starting walkthrough: ${found.title}`);
    setResponseMeta(null);
    saveHistoryEntry(`show me how ${found.title.toLowerCase()}`, `Started walkthrough: ${found.title}`);
  };

  const handleSubmit = async (): Promise<void> => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setIsLoading(true);
    const parsed = parseCommand(trimmed);

    if (parsed.type === 'navigate' && parsed.value) {
      const target = findNavigationTarget(parsed.value);
      if (target) {
        navigate(target.path);
        const message = `Navigating to ${target.label}.`;
        setResponse(message);
        setResponseMeta({ response: message, cacheHit: false, fallbackUsed: false });
        saveHistoryEntry(trimmed, message);
        setIsLoading(false);
        return;
      }
    }

    if (parsed.type === 'walkthrough' && parsed.value) {
      setIsLoading(false);
      handleWalkthroughStart(parsed.value);
      return;
    }

    if (parsed.type === 'search' && parsed.value) {
      const deepLink = await resolveDeepLinkSearch(parsed.value);
      if (deepLink) {
        navigate(deepLink.path);
        const message = `Opened ${deepLink.label}. ${deepLink.reason}.`;
        setResponse(message);
        setResponseMeta({ response: message, cacheHit: false, fallbackUsed: false });
        saveHistoryEntry(trimmed, message);
        setIsLoading(false);
        return;
      }
    }

    const result = await requestVoiceDocsResponse({ question: trimmed, appSection });
    setResponse(result.response);
    setResponseMeta(result);
    saveHistoryEntry(trimmed, result.response);
    setIsLoading(false);
  };

  const toggleListen = (): void => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setTimeout(() => {
      setQuery('take me to journal');
      setIsListening(false);
    }, 1400);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        data-testid="ask-docs-toggle"
        className={cn('fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg hover:scale-110', className)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Ask the Docs"
      >
        <MessageCircleQuestion className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={() => setIsOpen(false)}>
            <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 36 }} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900" onClick={(event) => event.stopPropagation()} data-testid="ask-docs-modal">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"><Book className="h-5 w-5 text-white" /></div><div><h3 className="font-bold text-gray-900 dark:text-white">Ask the Docs</h3><p className="text-xs text-gray-500 dark:text-gray-400">Context: {breadcrumbs.join(' > ') || appSection}</p></div></div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setPaletteOpen(true)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Open command palette"><Command className="h-4 w-4 text-gray-500" /></button>
                  <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"><X className="h-5 w-5 text-gray-500" /></button>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {discoveryPrompt && <div className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-200">{discoveryPrompt}</div>}

                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (<button key={suggestion} onClick={() => setQuery(suggestion)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">{suggestion}</button>))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {walkthroughQuickActions.map((action) => (<button key={action.id} type="button" onClick={() => handleWalkthroughStart(action.id)} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">{action.label}</button>))}
                </div>

                {response && (
                  <div className="rounded-xl bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                    <p>{response}</p>
                    {responseMeta && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{responseMeta.cacheHit ? 'Served from cache.' : responseMeta.fallbackUsed ? 'Fallback response used.' : 'Response generated for current context.'}</p>}
                  </div>
                )}

                <div data-help-history>
                  <HelpHistoryPanel
                  history={history.slice(0, 6)}
                  onSelect={(item) => {
                    setQuery(item.query);
                    setResponse(item.response);
                  }}
                  onClear={() => {
                    clearHelpHistory();
                    setHistory([]);
                  }}
                />
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <div className="flex gap-2">
                  <button onClick={toggleListen} className={cn('rounded-xl p-3', isListening ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700')}><Mic className="h-5 w-5" /></button>
                  <input data-help-input="true" type="text" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void handleSubmit()} placeholder="Try: take me to journal, show me how to export backup" className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <button onClick={() => void handleSubmit()} disabled={!query.trim() || isLoading} data-testid="ask-docs-send" className="rounded-xl bg-purple-600 p-3 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-5 w-5" /></button>
                </div>

                <a href="/help" className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"><ExternalLink className="h-4 w-4" />View full documentation</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HelpCommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={(target) => {
          navigate(target.path);
          setIsOpen(false);
        }}
      />

      <HelpWalkthroughOverlay
        walkthrough={activeWalkthrough}
        stepIndex={walkthroughStepIndex}
        onClose={() => setActiveWalkthrough(null)}
        onPrev={() => setWalkthroughStepIndex((previous) => Math.max(previous - 1, 0))}
        onNext={() => {
          if (!activeWalkthrough) {
            return;
          }

          setWalkthroughStepIndex((previous) => Math.min(previous + 1, activeWalkthrough.steps.length - 1));
        }}
      />
    </>
  );
}
