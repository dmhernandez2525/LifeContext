/**
 * OnboardingPage - First-time user experience
 * Uses the OnboardingWizard component for the full experience
 */
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { settings } = useAppStore();

  const handleComplete = () => {
    // Navigate to registration or app based on existing setup
    if (settings) {
      navigate('/app');
    } else {
      navigate('/register');
    }
  };

  const handleSkip = () => {
    // Skip goes straight to registration
    navigate('/register');
  };

  return (
    <OnboardingWizard 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
