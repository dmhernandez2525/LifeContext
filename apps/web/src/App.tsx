import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useKeyboardShortcuts } from './hooks';

// Components
import ErrorBoundary from './components/ErrorBoundary';


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
import DataBrokerOptOutPage from './pages/DataBrokerOptOutPage';
import ImportPage from './pages/ImportPage';
import HealthPage from './pages/HealthPage';
import LocationPage from './pages/LocationPage';
import PhotosPage from './pages/PhotosPage';
import OnThisDayPage from './pages/OnThisDayPage';
import PersonaPlexPage from './pages/PersonaPlexPage';
import DataReclamationMarketingPage from './pages/DataReclamationMarketingPage';
import HelpPage from './pages/HelpPage';
import FamilyPage from './pages/FamilyPage';

// Lazy load EmergencyAccessPage to avoid loading secrets.js-grempe on initial load
const EmergencyAccessPage = lazy(() => import('./pages/EmergencyAccessPage'));

// Layouts
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';



// Storage key for security credentials (same as RegisterPage/LockScreen)
const SECURITY_STORAGE_KEY = 'lcc-security';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    // Check if user has set up security credentials (passcode)
    const securityData = localStorage.getItem(SECURITY_STORAGE_KEY);
    
    if (securityData) {
      // User has registered - they have an account
      setHasAccount(true);
    }

    setIsReady(true);
  }, []);

  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  if (!isReady) {
    return null; // Loading state
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

          {/* Onboarding page (alternative to wizard) */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Registration - set up passcode */}
          <Route
            path="/register"
            element={
              hasAccount
                ? <Navigate to="/app" replace />
                : <RegisterPage onRegistered={() => setHasAccount(true)} />
            }
          />

          {/* App routes (require account) */}
          <Route
            path="/app"
            element={
              hasAccount ? <AppLayout /> : <Navigate to="/register" replace />
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
            <Route path="data-broker-optout" element={<DataBrokerOptOutPage />} />
            <Route path="import" element={<ImportPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="location" element={<LocationPage />} />
            <Route path="photos" element={<PhotosPage />} />
            <Route path="on-this-day" element={<OnThisDayPage />} />
            <Route path="persona-plex" element={<PersonaPlexPage />} />
            <Route path="storage-settings" element={<StorageSettingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="family" element={<FamilyPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
