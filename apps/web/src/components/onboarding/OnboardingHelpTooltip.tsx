import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingHelpTooltipProps {
  title: string;
  text: string;
}

export default function OnboardingHelpTooltip({ title, text }: OnboardingHelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" data-testid="onboarding-help-tooltip">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <HelpCircle className="h-4 w-4" />
        Why this matters
      </button>

      <div
        className={cn(
          'absolute right-0 top-12 z-20 w-72 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-xl dark:border-gray-700 dark:bg-gray-900',
          isOpen ? 'block' : 'hidden'
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close help"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{text}</p>
      </div>
    </div>
  );
}
