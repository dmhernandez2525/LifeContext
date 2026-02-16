interface HelpNpsPromptProps {
  isOpen: boolean;
  onRate: (score: number) => void;
  onDismiss: () => void;
}

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function HelpNpsPrompt({ isOpen, onRate, onDismiss }: HelpNpsPromptProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-testid="help-nps-prompt"
      className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/30"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
        Satisfaction Check
      </p>
      <p className="mt-1 text-sm text-blue-900 dark:text-blue-100">
        How likely are you to recommend Ask Docs to a friend?
      </p>
      <div className="mt-3 grid grid-cols-11 gap-1">
        {SCORES.map((score) => (
          <button
            key={score}
            type="button"
            data-testid={`help-nps-${score}`}
            onClick={() => onRate(score)}
            className="rounded-md bg-white px-1 py-1.5 text-xs text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-200 dark:hover:bg-blue-900"
          >
            {score}
          </button>
        ))}
      </div>
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-blue-700 underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
