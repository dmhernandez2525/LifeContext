import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFloatingTriggerPosition } from '@/hooks/useFloatingTriggerPosition';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { getVoiceDocsSectionFromPath, requestVoiceDocsResponse, type VoiceDocsResponse } from '@/services/voiceDocsService';
import { useTheme } from '../ThemeProvider';
import HelpAssistantModal from './HelpAssistantModal';
import HelpCommandPalette from './HelpCommandPalette';
import HelpFloatingTrigger from './HelpFloatingTrigger';
import HelpWalkthroughOverlay from './HelpWalkthroughOverlay';
import { resolveDeepLinkSearch } from './helpDeepLink';
import { clearHelpHistory, getHelpHistory, saveHelpHistoryItem } from './helpHistory';
import { triggerHelpHaptic } from './helpHaptics';
import { findNavigationTarget, getBreadcrumbs, getContextualSuggestions, parseCommand } from './helpNavigation';
import { walkthroughQuickActions, discoveryBySection } from './helpUiContent';
import { findWalkthrough, WALKTHROUGHS } from './helpWalkthroughs';
import {
  getHelpMinimized, getHelpTooltipSeen, getHelpUnreadCount, incrementHelpInteractionCount, markNpsPromptShown,
  saveHelpFeedback, saveNpsScore, setHelpMinimized, setHelpTooltipSeen, setHelpUnreadCount,
} from './helpUxStorage';
import type { HelpHistoryItem, WalkthroughDefinition } from './helpTypes';
import type { HelpFeedbackValue, HelpQuickAction } from './helpUxTypes';

interface AskDocsButtonProps { className?: string }
export default function AskDocsButton({ className }: AskDocsButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMeta, setResponseMeta] = useState<VoiceDocsResponse | null>(null);
  const [responseKey, setResponseKey] = useState('');
  const [history, setHistory] = useState<HelpHistoryItem[]>(() => getHelpHistory());
  const [activeWalkthrough, setActiveWalkthrough] = useState<WalkthroughDefinition | null>(null);
  const [walkthroughStepIndex, setWalkthroughStepIndex] = useState(0);
  const [discoveryPrompt, setDiscoveryPrompt] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(() => getHelpMinimized());
  const [unreadCount, setUnreadCount] = useState<number>(() => getHelpUnreadCount());
  const [showTooltip, setShowTooltip] = useState<boolean>(() => !getHelpTooltipSeen());
  const [showNpsPrompt, setShowNpsPrompt] = useState(false);

  const { position, style: triggerStyle, onPointerDown, setTriggerElement } = useFloatingTriggerPosition();
  const { isSupported: speechSupported, isListening, interimTranscript, errorMessage: speechError, startListening, stopListening } = useSpeechRecognition();
  const appSection = useMemo(() => getVoiceDocsSectionFromPath(location.pathname), [location.pathname]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(location.pathname), [location.pathname]);
  const suggestions = useMemo(() => getContextualSuggestions(appSection, breadcrumbs).slice(0, 4), [appSection, breadcrumbs]);

  const incrementUnread = useCallback(() => setUnreadCount((previous) => {
    const next = Math.min(previous + 1, 9);
    setHelpUnreadCount(next);
    return next;
  }), []);

  const openHelpModal = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
    setHelpUnreadCount(0);
    if (showTooltip) {
      setHelpTooltipSeen();
      setShowTooltip(false);
    }
    triggerHelpHaptic('light');
  }, [showTooltip]);

  const closeHelpModal = useCallback(() => {
    setIsOpen(false);
    stopListening();
    triggerHelpHaptic('light');
  }, [stopListening]);

  const recordInteraction = useCallback(() => {
    const interaction = incrementHelpInteractionCount();
    if (interaction.shouldPromptForNps) {
      markNpsPromptShown(interaction.count);
      setShowNpsPrompt(true);
    }
  }, []);

  const saveHistoryEntry = useCallback((requestQuery: string, answer: string) => {
    const entry = saveHelpHistoryItem({ query: requestQuery, response: answer, appSection, breadcrumbs });
    setHistory((previous) => [entry, ...previous].slice(0, 30));
    recordInteraction();
  }, [appSection, breadcrumbs, recordInteraction]);

  useEffect(() => {
    if (isMinimized && !isOpen) {
      incrementUnread();
    }
  }, [appSection, incrementUnread, isMinimized, isOpen]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        openHelpModal();
      }
    };

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [openHelpModal]);

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
  }, [activeWalkthrough, location.pathname, navigate, walkthroughStepIndex]);

  const trackResponse = (value: string, meta: VoiceDocsResponse | null, suffix: string): void => {
    setResponse(value);
    setResponseMeta(meta);
    setResponseKey(`${Date.now()}-${suffix}`);
  };

  const handleWalkthroughStart = (walkthroughIdOrQuery: string): void => {
    const found = WALKTHROUGHS.find((item) => item.id === walkthroughIdOrQuery) ?? findWalkthrough(walkthroughIdOrQuery);
    if (!found) {
      return;
    }

    setActiveWalkthrough(found);
    setWalkthroughStepIndex(0);
    trackResponse(`Starting walkthrough: ${found.title}`, null, found.id);
    saveHistoryEntry(`show me how ${found.title.toLowerCase()}`, `Started walkthrough: ${found.title}`);
  };

  const handleQuickAction = (action: HelpQuickAction): void => {
    navigate(action.path);
    const message = `Opened ${action.label}. ${action.description}.`;
    trackResponse(message, { response: message, cacheHit: false, fallbackUsed: false }, action.id);
    saveHistoryEntry(`quick action: ${action.label.toLowerCase()}`, message);
    triggerHelpHaptic('medium');
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
        trackResponse(message, { response: message, cacheHit: false, fallbackUsed: false }, target.id);
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
        trackResponse(message, { response: message, cacheHit: false, fallbackUsed: false }, deepLink.label);
        saveHistoryEntry(trimmed, message);
        setIsLoading(false);
        return;
      }
    }

    const result = await requestVoiceDocsResponse({ question: trimmed, appSection });
    trackResponse(result.response, result, 'response');
    saveHistoryEntry(trimmed, result.response);
    setIsLoading(false);
  };

  const toggleVoiceInput = (): void => {
    if (isListening) {
      stopListening();
      return;
    }

    if (!speechSupported) {
      trackResponse('Voice input is not supported in this browser.', null, 'speech-error');
      return;
    }

    startListening({ onFinalTranscript: (transcript) => setQuery(transcript) }); triggerHelpHaptic('light');
  };

  const toggleMinimized = (): void => {
    const next = !isMinimized;
    setIsMinimized(next);
    setHelpMinimized(next);
    if (next) {
      incrementUnread();
    }
    closeHelpModal();
  };

  const submitFeedback = (value: HelpFeedbackValue): void => {
    saveHelpFeedback({ query: query.trim() || 'help-response', appSection, value });
    triggerHelpHaptic('medium');
  };

  return (
    <>
      <HelpFloatingTrigger
        className={className}
        isMinimized={isMinimized}
        unreadCount={unreadCount}
        style={triggerStyle}
        position={position}
        showTooltip={showTooltip && !isOpen}
        setTriggerElement={setTriggerElement}
        onPointerDown={onPointerDown}
        onOpen={openHelpModal}
        onDismissTooltip={() => { setHelpTooltipSeen(); setShowTooltip(false); }}
      />

      <HelpAssistantModal
        isOpen={isOpen}
        isDark={isDark}
        appSection={appSection}
        breadcrumbs={breadcrumbs}
        discoveryPrompt={discoveryPrompt}
        suggestions={suggestions}
        query={query}
        response={response}
        responseMeta={responseMeta}
        responseKey={responseKey}
        history={history}
        isLoading={isLoading}
        isListening={isListening}
        interimTranscript={interimTranscript}
        speechError={speechError}
        showNpsPrompt={showNpsPrompt}
        setQuery={setQuery}
        onClose={closeHelpModal}
        onOpenPalette={() => setPaletteOpen(true)}
        onToggleMinimize={toggleMinimized}
        onSubmit={handleSubmit}
        onToggleVoiceInput={toggleVoiceInput}
        onQuickAction={handleQuickAction}
        onWalkthroughQuickAction={handleWalkthroughStart}
        onFeedbackSubmit={submitFeedback}
        onNpsDismiss={() => setShowNpsPrompt(false)}
        onNpsRate={(score) => { saveNpsScore(score); setShowNpsPrompt(false); triggerHelpHaptic('medium'); }}
        onHistorySelect={(item) => { setQuery(item.query); setResponse(item.response); setResponseKey(`${Date.now()}-history-${item.id}`); }}
        onHistoryClear={() => { clearHelpHistory(); setHistory([]); }}
        walkthroughQuickActions={walkthroughQuickActions}
      />

      <HelpCommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={(target) => { navigate(target.path); closeHelpModal(); }} />
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
