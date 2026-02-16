import { X } from 'lucide-react';

interface HelpOnboardingTooltipProps {
  isVisible: boolean;
  anchor: { x: number; y: number };
  onOpen: () => void;
  onDismiss: () => void;
}

export default function HelpOnboardingTooltip({
  isVisible,
  anchor,
  onOpen,
  onDismiss,
}: HelpOnboardingTooltipProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      data-testid="help-onboarding-tooltip"
      className="fixed z-[61] w-64 rounded-xl border border-purple-200 bg-white p-3 shadow-xl dark:border-purple-700 dark:bg-gray-900"
      style={{
        left: `${Math.max(16, anchor.x - 196)}px`,
        top: `${Math.max(16, anchor.y - 156)}px`,
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Need quick help?</p>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        Use Ask Docs for navigation, tutorials, and shortcuts from every page.
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="mt-3 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
      >
        Show me
      </button>
    </div>
  );
}
