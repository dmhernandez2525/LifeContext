/**
 * PersonaPlex AI engine.
 * Manages conversational context, message history, and AI response generation.
 * Uses a local-first approach with optional LLM integration.
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  context?: MessageContext;
}

export interface MessageContext {
  journalCount?: number;
  recentMood?: string;
  recentTopics?: string[];
  healthSummary?: string;
  location?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Generate a system prompt incorporating user's life context.
 */
export function buildSystemPrompt(context: MessageContext): string {
  const parts = [
    'You are PersonaPlex, a thoughtful AI companion for life reflection and personal growth.',
    'You have access to the user\'s journal entries, health data, and personal context.',
    'Be warm, supportive, and insightful. Ask follow-up questions when appropriate.',
    'Keep responses concise (2-4 sentences) unless the user asks for more detail.',
  ];

  if (context.journalCount) {
    parts.push(`The user has ${context.journalCount} journal entries.`);
  }
  if (context.recentMood) {
    parts.push(`Their recent mood has been "${context.recentMood}".`);
  }
  if (context.recentTopics && context.recentTopics.length > 0) {
    parts.push(`Recent journal topics include: ${context.recentTopics.join(', ')}.`);
  }
  if (context.healthSummary) {
    parts.push(`Health note: ${context.healthSummary}`);
  }
  if (context.location) {
    parts.push(`Current location context: ${context.location}`);
  }

  return parts.join(' ');
}

/**
 * Generate a local response when no LLM is available.
 * Uses pattern matching for common queries.
 */
export function generateLocalResponse(message: string, context: MessageContext): string {
  const lower = message.toLowerCase();

  const patterns: Array<{ test: (q: string) => boolean; response: () => string }> = [
    {
      test: (q) => q.includes('how am i') || q.includes('how are things'),
      response: () => {
        if (context.recentMood) {
          return `Based on your recent entries, your mood has been "${context.recentMood}". Would you like to explore what's been influencing that?`;
        }
        return 'I don\'t have enough recent journal data to assess how things are going. Try writing a journal entry about your day, and I can offer more personalized insights.';
      },
    },
    {
      test: (q) => q.includes('summary') || q.includes('recap'),
      response: () => {
        const count = context.journalCount ?? 0;
        if (count === 0) return 'You haven\'t written any journal entries yet. Start by capturing your thoughts in the journal, and I\'ll be able to provide summaries.';
        return `You have ${count} journal entries. ${context.recentTopics?.length ? `Recent topics include ${context.recentTopics.slice(0, 3).join(', ')}.` : ''} Would you like me to focus on a specific time period or theme?`;
      },
    },
    {
      test: (q) => q.includes('health') || q.includes('exercise') || q.includes('sleep'),
      response: () => {
        if (context.healthSummary) return `Here's what I see: ${context.healthSummary}. Would you like to set any new health goals?`;
        return 'I don\'t have any health data yet. You can log metrics like steps, sleep, and exercise in the Health Tracker, and I\'ll be able to offer insights.';
      },
    },
    {
      test: (q) => q.includes('help') || q.includes('what can you do'),
      response: () => 'I can help you reflect on your journal entries, spot patterns in your mood and health, recall memories, and guide you through reflection exercises. Just ask me anything about your life data!',
    },
    {
      test: (q) => q.includes('grateful') || q.includes('gratitude'),
      response: () => 'Gratitude is a powerful practice. What are three things you\'re grateful for today? Writing them down can shift your perspective.',
    },
    {
      test: (q) => q.includes('stressed') || q.includes('anxious') || q.includes('overwhelmed'),
      response: () => 'I hear you. Stress can feel overwhelming. Try taking a few deep breaths right now. Then, would you like to write about what\'s on your mind? Sometimes getting it out helps.',
    },
  ];

  const match = patterns.find(p => p.test(lower));
  if (match) return match.response();

  return 'That\'s an interesting thought. Would you like to explore it further in a journal entry? I can help you reflect on it more deeply.';
}

/**
 * Create a new message object.
 */
export function createMessage(role: MessageRole, content: string, context?: MessageContext): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    context,
  };
}

/**
 * Create a new conversation.
 */
export function createConversation(title?: string): Conversation {
  return {
    id: crypto.randomUUID(),
    title: title ?? 'New Conversation',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Generate a conversation title from the first user message.
 */
export function generateTitle(message: string): string {
  const cleaned = message.replace(/[^\w\s]/g, '').trim();
  const words = cleaned.split(/\s+/).slice(0, 6);
  return words.join(' ') + (cleaned.split(/\s+/).length > 6 ? '...' : '');
}
