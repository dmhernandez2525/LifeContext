/**
 * ReflectionSession - Interactive guided reflection UI with prompts and text areas.
 */
import { useState, useCallback } from 'react';
import { CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import {
  CATEGORY_CONFIG,
  isSessionComplete,
  getSessionProgress,
  type ReflectionSession as SessionType,
} from '@/lib/guidedReflection';
import { cn } from '@/lib/utils';

interface ReflectionSessionProps {
  session: SessionType;
  onUpdateResponse: (promptId: string, response: string) => void;
  onComplete: () => void;
  onRestart: () => void;
}

export function ReflectionSessionView({
  session, onUpdateResponse, onComplete, onRestart,
}: ReflectionSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = getSessionProgress(session);
  const complete = isSessionComplete(session);
  const prompt = session.prompts[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < session.prompts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, session.prompts.length]);

  if (session.completedAt) {
    return (
      <div className="text-center py-8 space-y-3">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <p className="text-lg font-medium text-gray-900 dark:text-white">Reflection Complete</p>
        <p className="text-sm text-gray-500">
          You reflected on {session.prompts.length} prompts. Great work taking time for self-awareness.
        </p>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 mx-auto px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <RotateCcw className="w-4 h-4" /> Start New Session
        </button>
      </div>
    );
  }

  if (!prompt) return null;

  const config = CATEGORY_CONFIG[prompt.category];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Question {currentIndex + 1} of {session.prompts.length}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category badge */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <span className={cn("text-xs font-medium", config.color)}>{config.label}</span>
      </div>

      {/* Question */}
      <p className="text-lg font-medium text-gray-900 dark:text-white">{prompt.question}</p>

      {/* Response area */}
      <textarea
        value={session.responses[prompt.id] ?? ''}
        onChange={(e) => onUpdateResponse(prompt.id, e.target.value)}
        placeholder="Take your time to reflect..."
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {session.prompts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors",
                i === currentIndex
                  ? "bg-indigo-600"
                  : (session.responses[p.id] ?? '').trim()
                    ? "bg-green-400"
                    : "bg-gray-300 dark:bg-gray-600"
              )}
            />
          ))}
        </div>
        {currentIndex < session.prompts.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            disabled={!complete}
            className={cn(
              "px-4 py-2 text-sm rounded-lg text-white font-medium",
              complete ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            )}
          >
            Complete Reflection
          </button>
        )}
      </div>
    </div>
  );
}
