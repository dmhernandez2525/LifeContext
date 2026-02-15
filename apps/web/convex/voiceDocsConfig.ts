export const VOICE_DOCS_CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
export const VOICE_DOCS_RATE_LIMIT_WINDOW_MS = 1000 * 60 * 5; // 5 minutes
export const VOICE_DOCS_RATE_LIMIT_MAX_REQUESTS = 20;

const fallbackBySection: Record<string, string> = {
  dashboard:
    'The help service is temporarily unavailable. You can continue from Dashboard, open Questions to record structured context, or start a Brain Dump for unstructured capture.',
  journal:
    'The help service is temporarily unavailable. You can still add a journal entry now, then tag mood and energy from the journal editor.',
  'brain-dump':
    'The help service is temporarily unavailable. You can still start recording in Brain Dump and review synthesis once the model endpoint recovers.',
  settings:
    'The help service is temporarily unavailable. You can still manage encryption, storage, and export settings from this page.',
  default:
    'The help service is temporarily unavailable. You can continue using core features while we retry the AI backend.',
};

export const getFallbackResponse = (appSection: string): string => {
  return fallbackBySection[appSection] ?? fallbackBySection.default;
};

export const normalizeQuestion = (question: string): string => {
  return question.trim().toLowerCase().replace(/\s+/g, ' ');
};

export const buildCacheKey = (question: string, appSection: string): string => {
  const normalized = `${appSection}:${normalizeQuestion(question)}`;

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(index);
    hash |= 0;
  }

  return `vdocs-${Math.abs(hash)}`;
};

export const buildLifeContextSystemPrompt = (appSection: string): string => {
  return [
    'You are LifeContext Voice Docs, an in-app documentation assistant.',
    'Product position: a diary with insights, not a companion. Avoid emotional attachment language.',
    'Security model: zero-knowledge. Never suggest sending plaintext secrets to servers.',
    `Current app section: ${appSection}. Prioritize guidance for this section before general advice.`,
    'Response style: concise, actionable steps. Mention exact page names where relevant.',
    'If uncertain, acknowledge limits and provide the safest next action in-app.',
  ].join(' ');
};

export const getAnthropicModel = (): string => {
  return process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-latest';
};
