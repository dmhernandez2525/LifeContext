/**
 * ProactivePrompts - Display AI-generated prompts and reminders
 * 
 * Shows:
 * - Anniversary reminders
 * - Gap suggestions
 * - Mood-based prompts
 * - Follow-up questions
 */

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  Calendar,
  AlertCircle,
  Heart,
  MessageCircle,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProactivePrompts, ProactivePrompt, AnniversaryEvent } from '@/hooks/useProactivePrompts';

// ============================================================
// PROMPT CARD
// ============================================================

function PromptCard({ 
  prompt, 
  onDismiss,
  onAction
}: { 
  prompt: ProactivePrompt;
  onDismiss: () => void;
  onAction?: () => void;
}) {
  const typeConfig = {
    anniversary: { icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    gap: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    'mood-based': { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    'follow-up': { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    connection: { icon: Sparkles, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  };

  const { icon: Icon, color, bg } = typeConfig[prompt.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn('rounded-xl p-4 relative', bg)}
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>

      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg bg-white/50 dark:bg-black/20', color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {prompt.title}
            </h4>
            {prompt.priority === 'high' && (
              <span className="px-1.5 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded text-xs">
                Important
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {prompt.description}
          </p>

          {prompt.triggerContext && (
            <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">
              "{prompt.triggerContext}"
            </p>
          )}

          {prompt.suggestedQuestion && (
            <button
              onClick={onAction}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <span>Reflect on this</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// ANNIVERSARY CARD
// ============================================================

function AnniversaryCard({ anniversary }: { anniversary: AnniversaryEvent }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
          {anniversary.title}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {anniversary.excerpt || 'You recorded something meaningful on this day.'}
      </p>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

interface ProactivePromptsProps {
  compact?: boolean;
  maxPrompts?: number;
  onQuestionSelect?: (question: string) => void;
}

export function ProactivePrompts({ 
  compact = false, 
  maxPrompts = 5,
  onQuestionSelect
}: ProactivePromptsProps) {
  const { prompts, anniversaries, dismissPrompt, isLoading } = useProactivePrompts();

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  const visiblePrompts = prompts.slice(0, maxPrompts);
  const highPriorityCount = prompts.filter(p => p.priority === 'high').length;

  if (visiblePrompts.length === 0 && anniversaries.length === 0) {
    return compact ? null : (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <Bell className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">No prompts right now. Keep journaling!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Prompts for You
            {highPriorityCount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs">
                {highPriorityCount} new
              </span>
            )}
          </h3>
        </div>
      )}

      {/* Anniversaries */}
      {anniversaries.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
            📅 On this day...
          </p>
          {anniversaries.slice(0, 2).map((ann, i) => (
            <AnniversaryCard key={i} anniversary={ann} />
          ))}
        </div>
      )}

      {/* Prompts */}
      <AnimatePresence mode="popLayout">
        {visiblePrompts.map(prompt => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onDismiss={() => dismissPrompt(prompt.id)}
            onAction={() => {
              if (prompt.suggestedQuestion && onQuestionSelect) {
                onQuestionSelect(prompt.suggestedQuestion);
              }
            }}
          />
        ))}
      </AnimatePresence>

      {/* More prompts indicator */}
      {prompts.length > maxPrompts && (
        <p className="text-sm text-center text-gray-500">
          +{prompts.length - maxPrompts} more prompts
        </p>
      )}
    </div>
  );
}

export default ProactivePrompts;
