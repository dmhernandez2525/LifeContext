const SESSION_STORAGE_KEY = 'lcc-voice-docs-session-id';
const CONVERSATION_STORAGE_KEY = 'lcc-voice-docs-conversation-id';

const routeSectionMap: Array<{ test: RegExp; section: string }> = [
  { test: /\/app\/journal/, section: 'journal' },
  { test: /\/app\/brain-dump/, section: 'brain-dump' },
  { test: /\/app\/settings/, section: 'settings' },
  { test: /\/app/, section: 'dashboard' },
];

const fallbackBySection: Record<string, string> = {
  dashboard:
    'I can still help with navigation. Try Dashboard for an overview, Questions for guided prompts, or Brain Dump for free-form capture.',
  journal:
    'Journal support is available without AI right now. Start a new entry, then tag mood and energy before saving.',
  'brain-dump':
    'Brain Dump is available. Start recording and review transcription and synthesis after capture.',
  settings:
    'Settings are available. You can manage encryption, export, storage location, and theme preferences.',
  default:
    'Voice Docs backend is not connected. Core app workflows are still available.',
};

export interface VoiceDocsRequest {
  question: string;
  appSection: string;
}

export interface VoiceDocsResponse {
  response: string;
  cacheHit: boolean;
  fallbackUsed: boolean;
}

const createId = (prefix: string): string => {
  if ('crypto' in window && 'randomUUID' in window.crypto) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
};

const getOrCreateSessionId = (): string => {
  const existing = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const created = createId('voice-docs-session');
  localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
};

const getConversationId = (): string | undefined => {
  return localStorage.getItem(CONVERSATION_STORAGE_KEY) ?? undefined;
};

const setConversationId = (conversationId: string | null): void => {
  if (!conversationId) {
    return;
  }

  localStorage.setItem(CONVERSATION_STORAGE_KEY, conversationId);
};

const getFallback = (appSection: string): string => {
  return fallbackBySection[appSection] ?? fallbackBySection.default;
};

export const getVoiceDocsSectionFromPath = (pathname: string): string => {
  for (const rule of routeSectionMap) {
    if (rule.test.test(pathname)) {
      return rule.section;
    }
  }

  return 'default';
};

export const requestVoiceDocsResponse = async (
  request: VoiceDocsRequest
): Promise<VoiceDocsResponse> => {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  const question = request.question.trim();

  if (!convexUrl || !question) {
    return {
      response: getFallback(request.appSection),
      cacheHit: false,
      fallbackUsed: true,
    };
  }

  try {
    const result = await fetch(`${convexUrl}/voice-docs/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getOrCreateSessionId(),
        conversationId: getConversationId(),
        question,
        appSection: request.appSection,
      }),
    });

    if (!result.ok) {
      return {
        response: getFallback(request.appSection),
        cacheHit: false,
        fallbackUsed: true,
      };
    }

    const payload = (await result.json()) as {
      conversationId?: string | null;
      response?: string;
      cacheHit?: boolean;
      fallbackUsed?: boolean;
    };

    setConversationId(payload.conversationId ?? null);

    return {
      response: payload.response ?? getFallback(request.appSection),
      cacheHit: payload.cacheHit ?? false,
      fallbackUsed: payload.fallbackUsed ?? false,
    };
  } catch {
    return {
      response: getFallback(request.appSection),
      cacheHit: false,
      fallbackUsed: true,
    };
  }
};
