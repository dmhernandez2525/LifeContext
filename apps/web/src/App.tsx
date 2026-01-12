import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useKeyboardShortcuts } from './hooks';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import OnboardingWizard from './components/onboarding/OnboardingWizard';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MediaPage from './pages/MediaPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuestionsPage from './pages/QuestionsPage';
import BrainDumpPage from './pages/BrainDumpPage';
import SettingsPage from './pages/SettingsPage';
import JournalPage from './pages/JournalPage';
import OnboardingPage from './pages/OnboardingPage';
import TimelinePage from './pages/TimelinePage';
import AIInsightsPage from './pages/AIInsightsPage';
import PricingPage from './pages/PricingPage';
import DataSovereigntyPage from './pages/DataSovereigntyPage';
import FeaturesPage from './pages/FeaturesPage';
import SecureJournalingPage from './pages/SecureJournalingPage';
import LegacyBuildingPage from './pages/LegacyBuildingPage';
import RelationshipTechPage from './pages/RelationshipTechPage';
import SolutionParentsPage from './pages/SolutionParentsPage';
import SolutionPartnersPage from './pages/SolutionPartnersPage';
import SolutionGrowthPage from './pages/SolutionGrowthPage';
import StorageSettingsPage from './pages/StorageSettingsPage';
import DataReclamationPage from './pages/DataReclamationPage';
import GDPRRequestPage from './pages/GDPRRequestPage';
import PhilosophyPage from './pages/PhilosophyPage';
import LifePlanningPage from './pages/LifePlanningPage';
import FeatureRequestPage from './pages/FeatureRequestPage';
import PublicRoadmapPage from './pages/PublicRoadmapPage';
import DataReclamationMarketingPage from './pages/DataReclamationMarketingPage';
import HelpPage from './pages/HelpPage';

// Lazy load EmergencyAccessPage to avoid loading secrets.js-grempe on initial load
const EmergencyAccessPage = lazy(() => import('./pages/EmergencyAccessPage'));

// Layouts
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLocked, _setIsLocked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lcc-onboarding-complete');
    if (stored === 'true') {
      setOnboardingComplete(true);
      setIsAuthenticated(true);
    }
    setIsInitialized(true);
  }, []);

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  if (!isInitialized) {
      return null; // Or a loading spinner
  }

  if (!isAuthenticated && !isLocked) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <OnboardingWizard 
              onComplete={() => setIsAuthenticated(true)} 
              onSkip={() => setIsAuthenticated(true)}
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/data-sovereignty" element={<DataSovereigntyPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/secure-journaling" element={<SecureJournalingPage />} />
            <Route path="/legacy-building" element={<LegacyBuildingPage />} />
            <Route path="/relationship-tech" element={<RelationshipTechPage />} />
            <Route path="/solutions/parents" element={<SolutionParentsPage />} />
            <Route path="/solutions/partners" element={<SolutionPartnersPage />} />
            <Route path="/solutions/growth" element={<SolutionGrowthPage />} />
            <Route path="/philosophy" element={<PhilosophyPage />} />
            <Route path="/data-reclamation-info" element={<DataReclamationMarketingPage />} />
            <Route path="/feature-request" element={<FeatureRequestPage />} />
            <Route path="/roadmap" element={<PublicRoadmapPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/emergency-access" element={<EmergencyAccessPage />} />
          </Route>

          {/* Onboarding for first-time users */}
          <Route 
            path="/onboarding" 
            element={
              onboardingComplete && isInitialized 
                ? <Navigate to="/app" replace /> 
                : <OnboardingPage />
            } 
          />

          <Route 
            path="/register" 
            element={
              isInitialized 
                ? <Navigate to="/app" replace /> 
                : !onboardingComplete 
                  ? <Navigate to="/onboarding" replace />
                  : <RegisterPage />
            } 
          />

          {/* App routes (require initialization) */}
          <Route
            path="/app"
            element={
              isInitialized ? <AppLayout /> : <Navigate to="/register" replace />
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="questions" element={<QuestionsPage />} />
            <Route path="questions/:categorySlug" element={<QuestionsPage />} />
            <Route path="brain-dump" element={<BrainDumpPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="insights" element={<AIInsightsPage />} />
            <Route path="life-planning" element={<LifePlanningPage />} />
            <Route path="data-reclamation" element={<DataReclamationPage />} />
            <Route path="gdpr-requests" element={<GDPRRequestPage />} />
            <Route path="storage-settings" element={<StorageSettingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
