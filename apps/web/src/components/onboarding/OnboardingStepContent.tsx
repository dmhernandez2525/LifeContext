import { Check, ShieldCheck } from 'lucide-react';
import PasscodeConfirmation from '@/components/security/PasscodeConfirmation';
import { getIntentLabel } from './flow';
import type {
  OnboardingIntent,
  OnboardingMode,
  OnboardingStepDefinition,
  OnboardingVariant,
} from './types';

interface OnboardingStepContentProps {
  step: OnboardingStepDefinition;
  intent: OnboardingIntent;
  mode: OnboardingMode;
  variant: OnboardingVariant;
  passcodeConfirmed: boolean;
  dataReclamationEnabled: boolean;
  showPasscodeConfirm: boolean;
  importError: string | null;
  onIntentChange: (intent: OnboardingIntent) => void;
  onModeChange: (mode: OnboardingMode) => void;
  onDataReclamationChange: (enabled: boolean) => void;
  onRequestPasscodeConfirm: () => void;
  onClosePasscodeConfirm: () => void;
  onConfirmPasscode: () => void;
  onImportBackup: () => void;
}

const intentCards: Array<{
  id: OnboardingIntent;
  title: string;
  description: string;
}> = [
  {
    id: 'journaling',
    title: 'Journaling',
    description: 'Capture day-to-day thoughts and identify personal patterns over time.',
  },
  {
    id: 'therapy',
    title: 'Therapy',
    description: 'Prepare context packets for sessions and track emotional signals clearly.',
  },
  {
    id: 'legacy',
    title: 'Legacy',
    description: 'Build an encrypted life archive for long-term reflection and future sharing.',
  },
];

const summaryHighlights: Record<OnboardingIntent, string[]> = {
  journaling: ['Daily journal flow prioritized', 'Pattern and trend prompts emphasized'],
  therapy: ['Therapy-ready context framing enabled', 'Data reclamation surfaced earlier'],
  legacy: ['Long-term archive guidance prioritized', 'Extension setup highlighted for timeline depth'],
};

export default function OnboardingStepContent({
  step,
  intent,
  mode,
  variant,
  passcodeConfirmed,
  dataReclamationEnabled,
  showPasscodeConfirm,
  importError,
  onIntentChange,
  onModeChange,
  onDataReclamationChange,
  onRequestPasscodeConfirm,
  onClosePasscodeConfirm,
  onConfirmPasscode,
  onImportBackup,
}: OnboardingStepContentProps) {
  if (step.id === 'welcome') {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          LifeContext helps you gather personal context without turning your data into a product.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Onboarding variant: <span className="font-semibold">{variant}</span>
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {['Privacy first', 'Zero-knowledge', 'No gamification'].map((item) => (
            <span
              key={item}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onImportBackup}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Import encrypted backup
        </button>

        {importError && <p className="text-sm text-red-600 dark:text-red-300">{importError}</p>}
      </div>
    );
  }

  if (step.id === 'intent') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {intentCards.map((card) => {
            const isActive = intent === card.id;

            return (
              <button
                key={card.id}
                type="button"
                data-testid={`onboarding-intent-${card.id}`}
                onClick={() => onIntentChange(card.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/30'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{card.title}</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{card.description}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Setup depth</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
            Full setup includes more context options. Quick start gets you in faster.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onModeChange('full')}
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                mode === 'full'
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200'
              }`}
            >
              Full setup
            </button>
            <button
              type="button"
              data-testid="onboarding-quick-start"
              onClick={() => onModeChange('quick')}
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                mode === 'quick'
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200'
              }`}
            >
              Quick start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step.id === 'privacy') {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Encryption is performed client-side. Server storage receives encrypted blobs only.
          </p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This architecture favors sovereignty over convenience. Recovery depends on your passcode control.
        </p>
      </div>
    );
  }

  if (step.id === 'passcode') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-900 dark:text-red-100">
            If your passcode is lost, encrypted data cannot be decrypted by support.
          </p>
        </div>

        {passcodeConfirmed ? (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-300" />
            <p className="text-sm text-green-900 dark:text-green-100">Passcode responsibility confirmed.</p>
          </div>
        ) : (
          <button
            type="button"
            data-testid="onboarding-passcode-confirm"
            onClick={onRequestPasscodeConfirm}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Confirm passcode responsibility
          </button>
        )}

        {showPasscodeConfirm && (
          <PasscodeConfirmation onConfirmed={onConfirmPasscode} onCancel={onClosePasscodeConfirm} />
        )}
      </div>
    );
  }

  if (step.id === 'dataReclamation') {
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <input
          type="checkbox"
          checked={dataReclamationEnabled}
          onChange={(event) => onDataReclamationChange(event.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Enable data reclamation workflows</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
            This enables browser imports and GDPR request tools later in your dashboard.
          </p>
        </div>
      </label>
    );
  }

  if (step.id === 'extension') {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Install the extension when you want to import browsing context into your encrypted vault.
        </p>
        <a
          href="https://chrome.google.com/webstore/category/extensions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black dark:bg-white dark:text-gray-900"
        >
          Open Chrome Web Store
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="onboarding-summary">
      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuration summary</p>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
          Intent: {getIntentLabel(intent)} | Mode: {mode === 'quick' ? 'Quick start' : 'Full setup'}
        </p>
      </div>

      <div className="space-y-2">
        {summaryHighlights[intent].map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
            <Check className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-300" />
            <span>{item}</span>
          </div>
        ))}

        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
          <Check className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-300" />
          <span>Data reclamation: {dataReclamationEnabled ? 'Enabled' : 'Not enabled'}</span>
        </div>
      </div>
    </div>
  );
}
