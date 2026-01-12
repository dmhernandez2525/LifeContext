/**
 * LifeChapters - Visualization of life periods and transitions
 * 
 * Displays:
 * - Chapters of life grouped by year with themes
 * - Transition indicators
 * - Chapter summaries
 */

import { motion } from 'framer-motion';
import { 
  BookOpen,
  Calendar,
  MapPin,
  Heart,
  Briefcase,
  Home,
  User,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLifeChapters, LifeChapter, ChapterTransition } from '@/hooks/useLifeChapters';

// ============================================================
// TRANSITION ICON
// ============================================================

function TransitionIcon({ type }: { type: ChapterTransition['type'] }) {
  const icons = {
    career: Briefcase,
    relationship: Heart,
    location: MapPin,
    health: Activity,
    family: Home,
    personal: User,
  };
  const Icon = icons[type];
  return <Icon className="w-4 h-4" />;
}

// ============================================================
// CHAPTER CARD
// ============================================================

function ChapterCard({ 
  chapter, 
  isFirst 
}: { 
  chapter: LifeChapter; 
  isFirst: boolean;
}) {
  const moodColors = {
    positive: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    neutral: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
    challenging: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    mixed: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  };

  const moodBadgeColors = {
    positive: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    neutral: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    challenging: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    mixed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative rounded-2xl p-6 border bg-gradient-to-br',
        moodColors[chapter.moodSummary],
        isFirst && 'ring-2 ring-purple-500/50'
      )}
    >
      {isFirst && (
        <div className="absolute -top-2 -right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Current
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {chapter.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(chapter.startDate)}
              {chapter.endDate && ` — ${formatDate(chapter.endDate)}`}
            </span>
          </div>
        </div>
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium capitalize',
          moodBadgeColors[chapter.moodSummary]
        )}>
          {chapter.moodSummary}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {chapter.description}
      </p>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {chapter.recordingCount} recordings
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {chapter.journalCount} journals
          </span>
        </div>
      </div>

      {/* Themes */}
      {chapter.dominantThemes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {chapter.dominantThemes.map(theme => (
            <span 
              key={theme}
              className="px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              #{theme}
            </span>
          ))}
        </div>
      )}

      {/* Key Events */}
      {chapter.keyEvents.length > 0 && (
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-xs font-medium text-gray-500 mb-2">Key Events</p>
          <div className="flex flex-wrap gap-2">
            {chapter.keyEvents.map((event, i) => (
              <span 
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300"
              >
                <ArrowRight className="w-3 h-3" />
                {event}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Significance bar */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Chapter richness</span>
          <span>{Math.round(chapter.significance * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${chapter.significance * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// TRANSITION MARKER
// ============================================================

function TransitionMarker({ transition }: { transition: ChapterTransition }) {
  const typeColors = {
    career: 'bg-blue-500',
    relationship: 'bg-pink-500',
    location: 'bg-green-500',
    health: 'bg-red-500',
    family: 'bg-amber-500',
    personal: 'bg-purple-500',
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <div className={cn('p-2 rounded-full text-white', typeColors[transition.type])}>
        <TransitionIcon type={transition.type} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {transition.type} Transition
        </p>
        <p className="text-xs text-gray-500">
          {transition.date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function LifeChaptersView() {
  const { chapters, transitions, isLoading } = useLifeChapters();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Your Story is Just Beginning
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          As you record more about your life, we'll identify chapters and themes in your story.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Your Life Chapters
          </h2>
          <p className="text-sm text-gray-500">
            {chapters.length} chapter{chapters.length !== 1 && 's'} • {transitions.length} transition{transitions.length !== 1 && 's'}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Chapters */}
        <div className="space-y-8">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="relative pl-16">
              {/* Timeline dot */}
              <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-purple-500 border-4 border-white dark:border-gray-900" />
              
              <ChapterCard chapter={chapter} isFirst={index === 0} />

              {/* Show relevant transitions after this chapter */}
              {transitions
                .filter(t => 
                  t.date >= chapter.startDate && 
                  (!chapter.endDate || t.date <= chapter.endDate)
                )
                .slice(0, 2)
                .map(transition => (
                  <TransitionMarker key={transition.id} transition={transition} />
                ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LifeChaptersView;
