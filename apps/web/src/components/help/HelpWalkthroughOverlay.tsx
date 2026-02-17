import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { WalkthroughDefinition } from './helpTypes';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface HelpWalkthroughOverlayProps {
  walkthrough: WalkthroughDefinition | null;
  stepIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const getElementRect = (selector?: string): SpotlightRect | null => {
  if (!selector) {
    return null;
  }

  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
};

export default function HelpWalkthroughOverlay({
  walkthrough,
  stepIndex,
  onClose,
  onNext,
  onPrev,
}: HelpWalkthroughOverlayProps) {
  const step = walkthrough?.steps[stepIndex];
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  const totalSteps = walkthrough?.steps.length ?? 0;
  const isLastStep = stepIndex >= totalSteps - 1;

  useEffect(() => {
    const updateSpotlight = (): void => {
      setSpotlight(getElementRect(step?.selector));
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight, true);

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight, true);
    };
  }, [step?.selector]);

  const tooltipStyle = useMemo(() => {
    if (!spotlight) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    return {
      top: `${Math.min(spotlight.top + spotlight.height + 16, window.innerHeight - 220)}px`,
      left: `${Math.min(Math.max(spotlight.left, 16), window.innerWidth - 360)}px`,
      transform: 'translate(0, 0)',
    };
  }, [spotlight]);

  return (
    <AnimatePresence>
      {walkthrough && step && (
        <motion.div
          className="fixed inset-0 z-[75]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" />

          {spotlight && (
            <motion.div
              className="absolute rounded-xl border-2 border-purple-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
              initial={false}
              animate={{
                top: spotlight.top - 6,
                left: spotlight.left - 6,
                width: spotlight.width + 12,
                height: spotlight.height + 12,
              }}
            />
          )}

          <div className="absolute z-[76] w-[340px] rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900" style={tooltipStyle}>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-300">
                  Step {stepIndex + 1} of {totalSteps}
                </p>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</h4>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>

            {!spotlight && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-300">
                Target not visible yet. Continue to move to the next step.
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onPrev}
                disabled={stepIndex === 0}
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 dark:text-gray-300 dark:hover:bg-gray-800 dark:disabled:text-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={isLastStep ? onClose : onNext}
                className="inline-flex items-center gap-1 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                {isLastStep ? 'Done' : 'Next'}
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
