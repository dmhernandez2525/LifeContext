import type { ReactNode } from 'react';
import { Brain, Chrome, Database, Lock, Rocket, Shield, Target } from 'lucide-react';
import type { OnboardingIconName } from './types';

export const onboardingIconMap: Record<OnboardingIconName, ReactNode> = {
  brain: <Brain className="h-10 w-10" />,
  target: <Target className="h-10 w-10" />,
  shield: <Shield className="h-10 w-10" />,
  lock: <Lock className="h-10 w-10" />,
  database: <Database className="h-10 w-10" />,
  chrome: <Chrome className="h-10 w-10" />,
  rocket: <Rocket className="h-10 w-10" />,
};
