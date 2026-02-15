import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { importData } from '@/lib/data-transfer';
import { cn } from '@/lib/utils';
import {
  completeOnboardingSession,
  ensureOnboardingSession,
  skipOnboardingSession,
  trackOnboardingStepDuration,
  trackOnboardingStepViewed,
} from './analytics';
import { buildOnboardingSteps } from './flow';
import OnboardingHelpTooltip from './OnboardingHelpTooltip';
import OnboardingProgress from './OnboardingProgress';
import OnboardingSkipDialog from './OnboardingSkipDialog';
import OnboardingStepContent from './OnboardingStepContent';
import { onboardingIconMap } from './icons';
import { createOnboardingSessionId } from './session';
import {
  clearOnboardingDraft,
  getOrAssignOnboardingVariant,
  loadOnboardingDraft,
  saveOnboardingDraft,
  setOnboardingComplete,
} from './storage';
import type { OnboardingIntent, OnboardingMode, OnboardingVariant } from './types';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const DATA_RECLAMATION_KEY = 'lcc-data-reclamation';

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const draft = loadOnboardingDraft();
  const variantFromStorage = draft?.variant ?? getOrAssignOnboardingVariant();
  const [sessionId] = useState<string>(() => draft?.sessionId ?? createOnboardingSessionId());
  const [variant] = useState<OnboardingVariant>(variantFromStorage);
  const [startedAt] = useState<string>(() => draft?.startedAt ?? new Date().toISOString());
  const [intent, setIntent] = useState<OnboardingIntent>(draft?.intent ?? 'journaling');
  const [intentChosen, setIntentChosen] = useState<boolean>(() => Boolean(draft?.intentChosen));
  const [mode, setMode] = useState<OnboardingMode>(() => {
    if (draft?.mode) {
      return draft.mode;
    }
    return variantFromStorage === 'streamlined' ? 'quick' : 'full';
  });
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(draft?.currentStepIndex ?? 0);
  const [passcodeConfirmed, setPasscodeConfirmed] = useState<boolean>(draft?.passcodeConfirmed ?? false);
  const [showPasscodeConfirm, setShowPasscodeConfirm] = useState(false);
  const [dataReclamationEnabled, setDataReclamationEnabled] = useState<boolean>(
    draft?.dataReclamationEnabled ?? false
  );
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const steps = useMemo(() => buildOnboardingSteps(intent, mode, variant), [intent, mode, variant]);
  const currentStep = steps[currentStepIndex];
  const stepEnteredAtRef = useRef<number>(Date.now());

  useEffect(() => {
    ensureOnboardingSession(sessionId, variant, intent, mode, startedAt);
  }, [sessionId, variant, intent, mode, startedAt]);

  useEffect(() => {
    if (currentStepIndex > steps.length - 1) {
      setCurrentStepIndex(steps.length - 1);
    }
  }, [currentStepIndex, steps.length]);

  useEffect(() => {
    saveOnboardingDraft({
      sessionId,
      variant,
      intent,
      intentChosen,
      mode,
      currentStepIndex,
      passcodeConfirmed,
      dataReclamationEnabled,
      startedAt,
      updatedAt: new Date().toISOString(),
    });
  }, [
    currentStepIndex,
    dataReclamationEnabled,
    intent,
    intentChosen,
    mode,
    passcodeConfirmed,
    sessionId,
    startedAt,
    variant,
  ]);

  useEffect(() => {
    if (!currentStep) {
      return;
    }
    trackOnboardingStepViewed(sessionId, currentStep.id, intent, mode);
    stepEnteredAtRef.current = Date.now();
  }, [currentStep, intent, mode, sessionId]);

  const recordCurrentStepDuration = (): void => {
    if (!currentStep) {
      return;
    }
    const duration = Date.now() - stepEnteredAtRef.current;
    trackOnboardingStepDuration(sessionId, currentStep.id, duration);
  };

  const handleNext = (): void => {
    recordCurrentStepDuration();

    const isLastStep = currentStepIndex === steps.length - 1;
    if (isLastStep) {
      localStorage.setItem(DATA_RECLAMATION_KEY, String(dataReclamationEnabled));
      setOnboardingComplete(true);
      completeOnboardingSession(sessionId, intent, mode);
      clearOnboardingDraft();
      onComplete();
      return;
    }
    setCurrentStepIndex((previous) => Math.min(previous + 1, steps.length - 1));
  };

  const handleBack = (): void => {
    if (currentStepIndex === 0) {
      return;
    }
    recordCurrentStepDuration();
    setCurrentStepIndex((previous) => Math.max(previous - 1, 0));
  };

  const handleSkipConfirm = (): void => {
    if (!currentStep) {
      return;
    }
    recordCurrentStepDuration();
    setOnboardingComplete(true);
    skipOnboardingSession(sessionId, currentStep.id, intent, mode);
    clearOnboardingDraft();
    setShowSkipDialog(false);
    onSkip();
  };

  const handleImportBackup = (): void => {
    setImportError(null);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        return;
      }

      try {
        const content = await file.text();
        const parsed = JSON.parse(content) as { timestamp?: string };
        const restoreDate = parsed.timestamp ? new Date(parsed.timestamp).toLocaleDateString() : 'unknown date';

        const shouldRestore = window.confirm(`Restore encrypted backup from ${restoreDate}?`);
        if (!shouldRestore) {
          return;
        }
        await importData(parsed);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to import backup';
        setImportError(message);
      }
    };
    input.click();
  };

  const canProceed =
    currentStep?.id === 'passcode'
      ? passcodeConfirmed
      : currentStep?.id === 'intent'
        ? intentChosen
        : true;

  if (!currentStep) {
    return null;
  }
  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-white p-4 dark:bg-gray-950">
        <div className="flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-3">
            <OnboardingHelpTooltip title={currentStep.helpTitle} text={currentStep.helpText} />
            <button
              type="button"
              onClick={() => setShowSkipDialog(true)}
              data-testid="onboarding-skip-button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              Skip setup <X className="h-4 w-4" />
            </button>
          </div>

          <OnboardingProgress
            currentStepIndex={currentStepIndex}
            steps={steps}
            gradient={currentStep.gradient}
          />

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              >
                <div className={cn('mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-white', currentStep.gradient)}>
                  {onboardingIconMap[currentStep.icon]}
                </div>

                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">{currentStep.title}</h2>
                <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600 dark:text-gray-300">{currentStep.subtitle}</p>

                <div className="mx-auto mt-6 max-w-xl">
                  <OnboardingStepContent
                    step={currentStep}
                    intent={intent}
                    mode={mode}
                    variant={variant}
                    passcodeConfirmed={passcodeConfirmed}
                    dataReclamationEnabled={dataReclamationEnabled}
                    showPasscodeConfirm={showPasscodeConfirm}
                    importError={importError}
                    onIntentChange={(nextIntent) => {
                      setIntent(nextIntent);
                      setIntentChosen(true);
                    }}
                    onModeChange={setMode}
                    onDataReclamationChange={setDataReclamationEnabled}
                    onRequestPasscodeConfirm={() => setShowPasscodeConfirm(true)}
                    onClosePasscodeConfirm={() => setShowPasscodeConfirm(false)}
                    onConfirmPasscode={() => {
                      setPasscodeConfirmed(true);
                      setShowPasscodeConfirm(false);
                    }}
                    onImportBackup={handleImportBackup}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 dark:border-gray-800">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
                currentStepIndex === 0
                  ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              data-testid="onboarding-next-button"
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white',
                canProceed ? 'bg-purple-600 hover:bg-purple-700' : 'cursor-not-allowed bg-gray-400'
              )}
            >
              {currentStep.id === 'summary' ? 'Get Started' : 'Continue'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <OnboardingSkipDialog
        isOpen={showSkipDialog}
        onCancel={() => setShowSkipDialog(false)}
        onConfirm={handleSkipConfirm}
      />
    </>
  );
}
