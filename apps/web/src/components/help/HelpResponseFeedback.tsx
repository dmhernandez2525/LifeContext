import { useEffect, useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HelpFeedbackValue } from './helpUxTypes';

interface HelpResponseFeedbackProps {
  responseKey: string;
  onSubmit: (value: HelpFeedbackValue) => void;
}

export default function HelpResponseFeedback({ responseKey, onSubmit }: HelpResponseFeedbackProps) {
  const [selected, setSelected] = useState<HelpFeedbackValue | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [responseKey]);

  const submit = (value: HelpFeedbackValue): void => {
    setSelected(value);
    onSubmit(value);
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <p className="text-xs text-gray-500 dark:text-gray-400">Was this response helpful?</p>
      <button
        type="button"
        data-testid="help-feedback-up"
        onClick={() => submit('up')}
        className={cn(
          'rounded-md border px-2 py-1 text-xs transition-colors',
          selected === 'up'
            ? 'border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
            : 'border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
        )}
      >
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful
        </span>
      </button>
      <button
        type="button"
        data-testid="help-feedback-down"
        onClick={() => submit('down')}
        className={cn(
          'rounded-md border px-2 py-1 text-xs transition-colors',
          selected === 'down'
            ? 'border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
            : 'border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
        )}
      >
        <span className="inline-flex items-center gap-1">
          <ThumbsDown className="h-3.5 w-3.5" />
          Needs work
        </span>
      </button>
    </div>
  );
}
