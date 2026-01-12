import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/app-store';
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
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';
import JournalPage from './pages/JournalPage';
import OnboardingPage from './pages/OnboardingPage';
import TimelinePage from './pages/TimelinePage';
import AICompanionPage from './pages/AICompanionPage';
import PricingPage from './pages/PricingPage';
import DataSovereigntyPage from './pages/DataSovereigntyPage';
import FeaturesPage from './pages/FeaturesPage';
import SecureJournalingPage from './pages/SecureJournalingPage';
import LegacyBuildingPage from './pages/LegacyBuildingPage';
import RelationshipTechPage from './pages/RelationshipTechPage';
import SolutionParentsPage from './pages/SolutionParentsPage';
import SolutionPartnersPage from './pages/SolutionPartnersPage';
import SolutionGrowthPage from './pages/SolutionGrowthPage';
import EmergencyAccessPage from './pages/EmergencyAccessPage';
import StorageSettingsPage from './pages/StorageSettingsPage';

// Layouts
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';

// Check if user has completed onboarding
function hasCompletedOnboarding(): boolean {
  return localStorage.getItem('lcc-onboarding-complete') === 'true';
}

function App() {
  const isInitialized = useAppStore((state) => state.isInitialized);
  const onboardingComplete = hasCompletedOnboarding();
  
  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/data-ownership" element={<DataSovereigntyPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/features/journaling" element={<SecureJournalingPage />} />
          <Route path="/features/legacy" element={<LegacyBuildingPage />} />
          <Route path="/features/relationships" element={<RelationshipTechPage />} />
          <Route path="/solutions/parents" element={<SolutionParentsPage />} />
          <Route path="/solutions/partners" element={<SolutionPartnersPage />} />
          <Route path="/solutions/growth" element={<SolutionGrowthPage />} />
          
          <Route path="/security/emergency" element={<EmergencyAccessPage />} />
          <Route path="/settings/storage" element={<StorageSettingsPage />} />
          
          {/* Private Routes */}
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
          <Route path="companion" element={<AICompanionPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
