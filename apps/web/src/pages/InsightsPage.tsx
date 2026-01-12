/**
 * InsightsPage - Phase 2 Intelligent Understanding Dashboard
 * 
 * Central hub for:
 * - Emotional trends and mood analysis
 * - Life chapters and transitions
 * - Pattern recognition
 * - Cross-references
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Heart,
  BookOpen,
  Sparkles,
  TrendingUp,
  Users,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmotionalTrends } from '@/components/EmotionalTrends';
import { LifeChaptersView } from '@/components/LifeChapters';

// ============================================================
// TAB NAVIGATION
// ============================================================

type TabId = 'overview' | 'emotional' | 'chapters' | 'relationships';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: Tab[] = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: Brain,
    description: 'Summary of all insights'
  },
  { 
    id: 'emotional', 
    label: 'Emotional Wellness', 
    icon: Heart,
    description: 'Mood trends and correlations'
  },
  { 
    id: 'chapters', 
    label: 'Life Chapters', 
    icon: BookOpen,
    description: 'Your story in chapters'
  },
  { 
    id: 'relationships', 
    label: 'Relationships', 
    icon: Users,
    description: 'People in your story'
  },
];

// ============================================================
// OVERVIEW TAB CONTENT
// ============================================================

function OverviewContent() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat 
          icon={Heart} 
          label="Mood Trend" 
          value="Stable" 
          color="text-pink-500"
          bgColor="bg-pink-500/10"
        />
        <QuickStat 
          icon={BookOpen} 
          label="Life Chapters" 
          value="3" 
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <QuickStat 
          icon={Users} 
          label="Key People" 
          value="12" 
          color="text-green-500"
          bgColor="bg-green-500/10"
        />
        <QuickStat 
          icon={Sparkles} 
          label="Insights" 
          value="8" 
          color="text-purple-500"
          bgColor="bg-purple-500/10"
        />
      </div>

      {/* Highlights */}
      <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Recent Discoveries
        </h3>
        
        <div className="space-y-3">
          <DiscoveryCard 
            title="Kindness as Core Identity"
            description="Across your recordings, kindness emerges as your central value."
            type="pattern"
          />
          <DiscoveryCard 
            title="Exercise Boosts Your Mood"
            description="Days with exercise tags average 4.2/5 mood vs 3.1 without."
            type="correlation"
          />
          <DiscoveryCard 
            title="Connection vs Withdrawal"
            description="You express a desire for connection but describe withdrawing when stressed."
            type="tension"
          />
        </div>
      </div>

      {/* Preview Panels */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            Emotional Wellbeing
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Your mood has been stable this week. Most positive days involve exercise and family time.
          </p>
          <div className="flex items-center gap-4">
            <MoodIndicator mood="great" count={2} />
            <MoodIndicator mood="good" count={3} />
            <MoodIndicator mood="okay" count={2} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Current Chapter
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            You're in a chapter of growth and reinvention, focused on parenting and self-discovery.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
              #parenting
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
              #healing
            </span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
              #exercise
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function QuickStat({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  bgColor 
}: { 
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={cn('rounded-xl p-4', bgColor)}>
      <Icon className={cn('w-5 h-5 mb-2', color)} />
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function DiscoveryCard({ 
  title, 
  description, 
  type 
}: { 
  title: string;
  description: string;
  type: 'pattern' | 'correlation' | 'tension';
}) {
  const typeConfig = {
    pattern: { icon: TrendingUp, color: 'text-purple-500' },
    correlation: { icon: Brain, color: 'text-blue-500' },
    tension: { icon: RefreshCw, color: 'text-amber-500' },
  };
  const { icon: Icon, color } = typeConfig[type];

  return (
    <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
      <Icon className={cn('w-5 h-5 mt-0.5', color)} />
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function MoodIndicator({ mood, count }: { mood: string; count: number }) {
  const moodEmoji: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    low: '😔',
    bad: '😢',
  };
  
  return (
    <div className="flex items-center gap-1">
      <span className="text-xl">{moodEmoji[mood]}</span>
      <span className="text-sm text-gray-500">×{count}</span>
    </div>
  );
}

// ============================================================
// PLACEHOLDER FOR FUTURE TABS
// ============================================================

function RelationshipsContent() {
  return (
    <div className="text-center py-12">
      <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Relationship Mapping Coming Soon
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        We're building a feature to visualize the people in your story and how they connect.
      </p>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'emotional':
        return <EmotionalTrends />;
      case 'chapters':
        return <LifeChaptersView />;
      case 'relationships':
        return <RelationshipsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="w-7 h-7 text-purple-500" />
          Insights
        </h1>
        <p className="text-gray-500 mt-1">
          Discover patterns, track wellness, and explore the chapters of your life.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default InsightsPage;
