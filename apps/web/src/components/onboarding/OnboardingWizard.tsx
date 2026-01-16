/**
 * OnboardingWizard - Funny, skippable introduction to LifeContext
 * Shows on first login to guide users through setup
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Shield, 
  Database, 
  Chrome, 
  Rocket,
  Brain,
  Lock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PasscodeConfirmation from '../security/PasscodeConfirmation';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  gradient: string;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPasscodeConfirm, setShowPasscodeConfirm] = useState(false);
  const [passcodeConfirmed, setPasscodeConfirmed] = useState(false);
  const [dataReclamationEnabled, setDataReclamationEnabled] = useState(false);

  const steps: WizardStep[] = [
    {
      id: 'welcome',
      title: 'Your Brain is a Terrible Hard Drive',
      subtitle: 'Let\'s fix that.',
      icon: <Brain className="w-8 h-8 sm:w-12 sm:h-12" />,
      gradient: 'from-purple-500 to-pink-500',
      content: (
        <div className="text-center space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Remember that genius idea you had in the shower last Tuesday? Neither do we.
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <strong>LifeContext</strong> is your personal diary with superpowers. It asks questions,
            spots patterns, and helps you actually understand your own life.
          </p>
          <div className="pt-2 sm:pt-4 flex flex-wrap gap-2 sm:gap-3 justify-center">
            {['Not a therapist', 'Not a friend', 'Just data'].map((tag) => (
              <span key={tag} className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs sm:text-sm">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'privacy',
      title: 'We Literally Can\'t Read Your Data',
      subtitle: 'Not "won\'t". Can\'t.',
      icon: <Shield className="w-8 h-8 sm:w-12 sm:h-12" />,
      gradient: 'from-blue-500 to-cyan-500',
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
            Your data is encrypted with a key derived from your passcode.
            We never see the passcode. We never see the key. We never see your data.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
            <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm">
              <strong>Zero-Knowledge Architecture</strong>: Even if the FBI showed up with a warrant,
              we couldn't hand over your data because we literally don't have it.
            </p>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm text-center">
            (This also means if you lose your passcode, we REALLY can't help you.
            We'll address that next.)
          </p>
        </div>
      ),
    },
    {
      id: 'passcode',
      title: 'Set Your Passcode (This Is Important)',
      subtitle: 'No really. PAY ATTENTION.',
      icon: <Lock className="w-8 h-8 sm:w-12 sm:h-12" />,
      gradient: 'from-red-500 to-orange-500',
      content: (
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 sm:p-4">
            <p className="text-red-800 dark:text-red-200 text-xs sm:text-sm">
              <strong>⚠️ If you lose this passcode, your data is GONE FOREVER.</strong>
            </p>
            <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm mt-2">
              We cannot reset it. We cannot recover it. This is the price of true privacy.
            </p>
          </div>

          {passcodeConfirmed ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 sm:p-4 flex items-center gap-3">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-200 text-sm">
                You've acknowledged the security requirements. Good human.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowPasscodeConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 rounded-xl transition-colors min-h-[48px]"
            >
              I Understand the Risks - Confirm
            </button>
          )}
        </div>
      ),
    },
    {
      id: 'data-reclamation',
      title: 'Your Data is Already Out There',
      subtitle: 'Let\'s get it back.',
      icon: <Database className="w-8 h-8 sm:w-12 sm:h-12" />,
      gradient: 'from-green-500 to-teal-500',
      content: (
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
            Google knows your search history. Meta knows your relationships.
            Data brokers sell your home address. Want to see what they have?
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dataReclamationEnabled}
                onChange={(e) => setDataReclamationEnabled(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  Enable Data Reclamation
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Export your browser history, request your data from platforms,
                  and see yourself as algorithms see you.
                </p>
              </div>
            </label>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
            You can change this anytime in Settings. All data stays encrypted on YOUR device.
          </p>
        </div>
      ),
    },
    {
      id: 'extension',
      title: 'Get the Browser Extension',
      subtitle: '(Optional but recommended)',
      icon: <Chrome className="w-8 h-8 sm:w-12 sm:h-12" />,
      gradient: 'from-yellow-500 to-amber-500',
      content: (
        <div className="space-y-3 sm:space-y-4 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Our Chrome extension lets you export 5+ years of browsing history
            to build a complete picture of your digital footprint.
          </p>

          <div className="flex gap-3 justify-center">
            <a
              href="https://chrome.google.com/webstore/category/extensions"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 sm:px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform text-sm sm:text-base min-h-[48px] flex items-center"
            >
              Get Chrome Extension
            </a>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Coming soon to Firefox and Safari.
          </p>
        </div>
      ),
    },
    {
      id: 'ready',
      title: 'You\'re Ready to Document Your Life',
      subtitle: 'Let\'s go.',
      icon: <Rocket className="w-8 h-8 sm:w-12 sm:h-12" />,
      gradient: 'from-indigo-500 to-purple-500',
      content: (
        <div className="space-y-3 sm:space-y-4 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Start by answering a few questions, or just do a Brain Dump of whatever's on your mind.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2">
            {[
              { label: 'Answer Questions', desc: 'Guided prompts about your life' },
              { label: 'Brain Dump', desc: 'Just ramble. We\'ll organize it.' },
              { label: 'Daily Journal', desc: 'Quick daily check-ins' },
              { label: 'AI Insights', desc: 'See patterns in your data' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 rounded-xl text-left">
                <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{item.label}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStep !== 2 || passcodeConfirmed; // Can't skip passcode step without confirming

  const handleNext = () => {
    if (isLastStep) {
      // Save preferences
      localStorage.setItem('lcc-onboarding-complete', 'true');
      localStorage.setItem('lcc-data-reclamation', dataReclamationEnabled.toString());
      onComplete();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    localStorage.setItem('lcc-onboarding-complete', 'true');
    onSkip();
  };

  return (
    <>
      <div className="fixed inset-0 bg-white dark:bg-gray-950 sm:bg-gradient-to-br sm:from-gray-900 sm:via-purple-900 sm:to-gray-900 flex items-center justify-center z-50 sm:p-4">
        <div className="bg-white dark:bg-gray-900 sm:rounded-3xl max-w-lg w-full h-full sm:h-auto shadow-2xl overflow-hidden flex flex-col">
          {/* Header with Skip */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 min-h-[44px] px-2"
            >
              Skip setup <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-800">
            <motion.div
              className={cn("h-full bg-gradient-to-r", currentStepData.gradient)}
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-8"
              >
                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br mx-auto mb-4 sm:mb-6 flex items-center justify-center text-white",
                  currentStepData.gradient
                )}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                    {currentStepData.icon}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                  {currentStepData.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-4 sm:mb-6">
                  {currentStepData.subtitle}
                </p>

                {/* Step Content */}
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-800 mt-auto"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl transition-colors min-h-[44px]",
                currentStep === 0
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all min-h-[44px]",
                canProceed
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
            >
              {isLastStep ? 'Get Started' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Passcode Confirmation Modal */}
      {showPasscodeConfirm && (
        <PasscodeConfirmation
          onConfirmed={() => {
            setPasscodeConfirmed(true);
            setShowPasscodeConfirm(false);
          }}
          onCancel={() => setShowPasscodeConfirm(false)}
        />
      )}
    </>
  );
}
