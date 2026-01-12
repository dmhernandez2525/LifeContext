/**
 * OnboardingPage - First-time user experience walkthrough
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Mic, 
  Brain, 
  Lock,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Life Context',
    subtitle: 'Your private life documentation journal',
    icon: <Sparkles className="w-12 h-12" />,
    color: 'from-purple-500 to-blue-500',
    content: (
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Life Context helps you record, organize, and understand your life story through thoughtful questions and AI-powered insights.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">50+</p>
            <p className="text-sm text-gray-500">Questions</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">15</p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-2xl font-bold text-green-600">∞</p>
            <p className="text-sm text-gray-500">Memories</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy First',
    subtitle: 'Your data never leaves your device',
    icon: <Shield className="w-12 h-12" />,
    color: 'from-green-500 to-emerald-500',
    content: (
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Local Storage Only</h4>
            <p className="text-gray-600 dark:text-gray-400">All your recordings, transcripts, and insights are stored locally in your browser. Nothing goes to remote servers.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">End-to-End Encryption</h4>
            <p className="text-gray-600 dark:text-gray-400">Your content is encrypted with AES-256-GCM using a key derived from your passcode.</p>
          </div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>You're in control.</strong> If you use your own API keys, your data goes directly to AI providers. We never see it.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'voice',
    title: 'Voice Native',
    subtitle: 'Speak naturally, we transcribe',
    icon: <Mic className="w-12 h-12" />,
    color: 'from-red-500 to-pink-500',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
          Most of us think faster than we type. Life Context is designed for speaking, not typing.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
            <Mic className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Voice Recording</p>
            <p className="text-sm text-gray-500">Just start talking</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
            <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">AI Transcription</p>
            <p className="text-sm text-gray-500">We handle the rest</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          You can also type if you prefer. The choice is yours.
        </p>
      </div>
    ),
  },
  {
    id: 'insights',
    title: 'AI-Powered Insights',
    subtitle: 'Discover patterns in your life story',
    icon: <Brain className="w-12 h-12" />,
    color: 'from-purple-500 to-violet-500',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
          As you share more, our AI helps identify themes, strengths, and growth opportunities.
        </p>
        <div className="space-y-3">
          {[
            { type: 'Recurring Themes', desc: 'Ideas that appear across your responses' },
            { type: 'Strengths', desc: 'Consistent positive traits you demonstrate' },
            { type: 'Growth Areas', desc: 'Opportunities for personal development' },
            { type: 'Blind Spots', desc: 'Things you might not see about yourself' },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Check className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.type}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { settings } = useAppStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Mark onboarding as complete in localStorage
    localStorage.setItem('lcc-onboarding-complete', 'true');
    
    // Navigate to registration/app
    if (settings) {
      navigate('/app');
    } else {
      navigate('/register');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('lcc-onboarding-complete', 'true');
    navigate('/register');
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Skip
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center space-x-2 pt-8">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === currentStep
                ? "w-8 bg-blue-600"
                : i < currentStep
                ? "bg-blue-400"
                : "bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Icon */}
              <div className="text-center">
                <div className={cn(
                  "w-24 h-24 rounded-3xl bg-gradient-to-br mx-auto flex items-center justify-center text-white",
                  step.color
                )}>
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {step.subtitle}
                </p>
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                {step.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6">
        <div className="max-w-lg mx-auto flex space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all",
              currentStep === 0
                ? "opacity-0 pointer-events-none"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            {isLastStep ? (
              <>
                Get Started
                <Check className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
