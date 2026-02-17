/**
 * ReflectionPage - Guided reflection exercises.
 */
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { ReflectionSessionView } from '@/components/ai/ReflectionSession';
import {
  generateReflectionSession,
  REFLECTION_CATEGORIES,
  CATEGORY_CONFIG,
  type ReflectionCategory,
  type ReflectionSession,
} from '@/lib/guidedReflection';
import { cn } from '@/lib/utils';

export default function ReflectionPage() {
  const [session, setSession] = useState<ReflectionSession | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<ReflectionCategory>>(new Set());

  const toggleCategory = (cat: ReflectionCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const startSession = useCallback(() => {
    const cats = selectedCategories.size > 0 ? Array.from(selectedCategories) : undefined;
    setSession(generateReflectionSession(cats));
  }, [selectedCategories]);

  const handleUpdateResponse = useCallback((promptId: string, response: string) => {
    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, responses: { ...prev.responses, [promptId]: response } };
    });
  }, []);

  const handleComplete = useCallback(() => {
    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, completedAt: Date.now() };
    });
  }, []);

  const handleRestart = useCallback(() => {
    setSession(null);
    setSelectedCategories(new Set());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
          <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Guided Reflection</h1>
          <p className="text-sm text-gray-500">Thoughtful prompts for self-discovery</p>
        </div>
      </div>

      {session ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <ReflectionSessionView
            session={session}
            onUpdateResponse={handleUpdateResponse}
            onComplete={handleComplete}
            onRestart={handleRestart}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose categories you'd like to reflect on, or start with a random selection.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REFLECTION_CATEGORIES.map(cat => {
              const config = CATEGORY_CONFIG[cat];
              const active = selectedCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border transition-colors text-left",
                    active
                      ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <span className="text-xl">{config.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{config.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={startSession}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            {selectedCategories.size > 0
              ? `Start Reflection (${selectedCategories.size} categories)`
              : 'Start Random Reflection'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
