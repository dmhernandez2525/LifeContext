import { motion } from 'framer-motion';
import type { OnboardingStepDefinition } from './types';

interface OnboardingProgressProps {
  currentStepIndex: number;
  steps: OnboardingStepDefinition[];
  gradient: string;
}

export default function OnboardingProgress({
  currentStepIndex,
  steps,
  gradient,
}: OnboardingProgressProps) {
  const totalSteps = steps.length;
  const currentStep = currentStepIndex + 1;
  const remaining = Math.max(totalSteps - currentStep, 0);

  return (
    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span data-testid="onboarding-step-counter">Step {currentStep} of {totalSteps}</span>
        <span>{remaining} remaining</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient}`}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ type: 'spring', stiffness: 160, damping: 25 }}
        />
      </div>

      <div className="mt-2 flex gap-1.5">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-1.5 flex-1 rounded-full ${
              index <= currentStepIndex ? 'bg-gray-700 dark:bg-gray-200' : 'bg-gray-200 dark:bg-gray-800'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
