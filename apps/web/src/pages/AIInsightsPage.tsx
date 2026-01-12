/**
 * AIInsightsPage - Conversational interface for life context insights
 * Note: This is NOT a companion - it's an insights engine that asks questions and provides data-driven observations.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { db } from '@lcc/storage';
import { generateWithClaude } from '@lcc/llm';

// ============================================================
// TYPES
// ============================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationContext {
  recordings: string[];
  patterns: string[];
  journalMoods: string[];
}

// ============================================================
// SUGGESTED PROMPTS
// ============================================================

const SUGGESTED_PROMPTS = [
  "What themes have emerged from my life story so far?",
  "What patterns do you see in my relationships?",
  "What are my core strengths based on my recordings?",
  "How has my mood been trending lately?",
  "What growth areas should I focus on?",
  "Help me reflect on my career journey",
  "What contradictions do you notice in my values?",
  "Summarize who I am based on everything I've shared",
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<ConversationContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settings = useAppStore((state) => state.settings);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load context from database
  const loadContext = useCallback(async () => {
    try {
      const recordings = await db.recordings.toArray();
      const patterns = await db.patterns.toArray();
      const journals = await db.journalEntries.toArray();

      const recordingTexts = recordings
        .filter(r => r.transcriptionText)
        .slice(-20) // Last 20 recordings
        .map(r => r.transcriptionText || '');

      const patternTexts = patterns
        .slice(-10)
        .map(p => `${p.type}: ${p.description}`);

      const journalMoods = journals
        .slice(-14) // Last 2 weeks
        .filter(j => j.mood)
        .map(j => `${new Date(j.date).toLocaleDateString()}: ${j.mood}`);

      setContext({
        recordings: recordingTexts as string[],
        patterns: patternTexts,
        journalMoods: journalMoods as string[],
      });
    } catch (err) {
      console.error('Failed to load context:', err);
    }
  }, []);

  useEffect(() => {
    loadContext();
  }, [loadContext]);

  // Build system prompt with context
  const buildSystemPrompt = () => {
    let prompt = `You are an AI insights engine for Life Context. You analyze the user's journal entries and provide data-driven observations, patterns, and questions to help them understand themselves better. You are NOT a companion or therapist - you are a diary that asks questions and surfaces insights.

Your role:
- Provide insights based on what the user has shared in their recordings and journal entries
- Ask thoughtful follow-up questions to deepen understanding
- Identify patterns, themes, strengths, and growth areas
- Be warm, encouraging, and non-judgmental
- Keep responses concise but meaningful (2-3 paragraphs max)
- Reference specific details the user has shared when relevant

`;

    if (context) {
      if (context.recordings.length > 0) {
        prompt += `\nUser's recent recordings (transcripts):\n${context.recordings.join('\n---\n')}\n`;
      }
      
      if (context.patterns.length > 0) {
        prompt += `\nDiscovered patterns in user's life story:\n${context.patterns.join('\n')}\n`;
      }

      if (context.journalMoods.length > 0) {
        prompt += `\nRecent journal moods:\n${context.journalMoods.join('\n')}\n`;
      }
    }

    return prompt;
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = settings?.aiProvider.apiKey;
      
      if (!apiKey) {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "I'd love to help, but I need an API key to work. Please add your Anthropic API key in Settings to enable AI conversations.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      // Build conversation history for Claude
      const conversationHistory = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
      conversationHistory.push({ role: 'user', content: input.trim() });

      const response = await generateWithClaude({
        systemPrompt: buildSystemPrompt(),
        messages: conversationHistory,
        apiKey,
        maxTokens: 500,
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI response error:', err);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I encountered an error processing your request. Please check your API key in Settings and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clear conversation
  const handleClear = () => {
    if (messages.length > 0 && confirm('Clear conversation history?')) {
      setMessages([]);
    }
  };

  // Use suggested prompt
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Insights
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your personal life insights assistant
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={loadContext}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Refresh context"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Let's explore your life story
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
              I'm here to help you discover patterns, reflect on your journey, and gain insights from everything you've shared.
            </p>
            
            {/* Suggested prompts */}
            <div className="w-full max-w-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Try asking:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-start space-x-3",
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  message.role === 'user' 
                    ? "bg-blue-500" 
                    : "bg-gradient-to-br from-purple-500 to-pink-500"
                )}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                )}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="mt-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your life story..."
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
