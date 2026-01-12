/**
 * EmotionalTrends - Visualization of mood patterns over time
 * 
 * Displays:
 * - Mood trends chart
 * - Weekly summaries
 * - Tag correlations
 * - Actionable insights
 */

import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotionalTrends, EmotionalInsight, EmotionalPeriod, EmotionalCorrelation } from '@/hooks/useEmotionalTrends';

// ============================================================
// MOOD CHART
// ============================================================

function MoodChart({ data }: { data: { date: Date; moodScore: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No mood data yet
      </div>
    );
  }

  const maxScore = 5;
  const width = 100;
  const height = 60;
  const padding = 4;
  
  const points = data.slice(-14).map((d, i, arr) => {
    const x = padding + (i / (arr.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - ((d.moodScore / maxScore) * (height - 2 * padding));
    return { x, y, score: d.moodScore, date: d.date };
  });

  const pathD = points.length > 1
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const areaD = points.length > 1
    ? `M ${points[0].x},${height - padding} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},${height - padding} Z`
    : '';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      {/* Gradient fill */}
      <defs>
        <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      {areaD && <path d={areaD} fill="url(#moodGradient)" />}
      
      {/* Line */}
      {pathD && (
        <path 
          d={pathD} 
          fill="none" 
          stroke="rgb(168, 85, 247)" 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      
      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2"
          fill="white"
          stroke="rgb(168, 85, 247)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

// ============================================================
// TREND INDICATOR
// ============================================================

function TrendIndicator({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  const config = {
    improving: {
      icon: TrendingUp,
      label: 'Improving',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    stable: {
      icon: Minus,
      label: 'Stable',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    declining: {
      icon: TrendingDown,
      label: 'Declining',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  };

  const { icon: Icon, label, color, bg } = config[trend];

  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', bg)}>
      <Icon className={cn('w-4 h-4', color)} />
      <span className={cn('text-sm font-medium', color)}>{label}</span>
    </div>
  );
}

// ============================================================
// PERIOD CARD
// ============================================================

function PeriodCard({ period }: { period: EmotionalPeriod }) {
  const moodColors = {
    great: 'bg-green-500',
    good: 'bg-emerald-500',
    neutral: 'bg-blue-500',
    challenging: 'bg-amber-500',
    difficult: 'bg-red-500',
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">
          {formatDate(period.startDate)} - {formatDate(period.endDate)}
        </span>
        <div className={cn('w-3 h-3 rounded-full', moodColors[period.label])} />
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl font-bold">{period.averageMood.toFixed(1)}</span>
        <span className="text-sm text-gray-500">/ 5</span>
        <span className="text-sm font-medium capitalize ml-auto text-gray-600 dark:text-gray-400">
          {period.label}
        </span>
      </div>
      
      {period.dominantTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {period.dominantTags.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================
// CORRELATION BADGE
// ============================================================

function CorrelationBadge({ correlation }: { correlation: EmotionalCorrelation }) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg',
      correlation.isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    )}>
      <span className={cn(
        'text-sm font-medium',
        correlation.isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
      )}>
        #{correlation.tag}
      </span>
      <span className="text-xs text-gray-500">
        {correlation.averageMood.toFixed(1)} avg • {correlation.occurrences} times
      </span>
    </div>
  );
}

// ============================================================
// INSIGHT CARD
// ============================================================

function InsightCard({ insight }: { insight: EmotionalInsight }) {
  const iconMap = {
    trend: Sparkles,
    correlation: Activity,
    pattern: Lightbulb,
    warning: AlertTriangle,
  };

  const colorMap = {
    trend: 'text-purple-500',
    correlation: 'text-blue-500',
    pattern: 'text-amber-500',
    warning: 'text-red-500',
  };

  const Icon = iconMap[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-700', colorMap[insight.type])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {insight.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {insight.description}
          </p>
          {insight.actionable && (
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <ChevronRight className="w-4 h-4" />
              <span>{insight.actionable}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function EmotionalTrends() {
  const { 
    moodData, 
    periods, 
    correlations, 
    insights, 
    averageMood, 
    moodTrend, 
    isLoading 
  } = useEmotionalTrends();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  const positiveCorrelations = correlations.filter(c => c.isPositive).slice(0, 3);
  const negativeCorrelations = correlations.filter(c => !c.isPositive).slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Emotional Wellness
            </h3>
            <p className="text-sm text-gray-500">
              Based on {moodData.length} journal entries
            </p>
          </div>
          <TrendIndicator trend={moodTrend} />
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div>
            <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {averageMood.toFixed(1)}
            </span>
            <span className="text-lg text-gray-500 ml-1">/ 5</span>
          </div>
          <span className="text-sm text-gray-500 pb-1">
            average mood
          </span>
        </div>

        <MoodChart data={moodData} />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Insights
          </h3>
          <AnimatePresence>
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Correlations */}
      {(positiveCorrelations.length > 0 || negativeCorrelations.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            What Affects Your Mood
          </h3>
          
          {positiveCorrelations.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                Mood Boosters
              </p>
              <div className="flex flex-wrap gap-2">
                {positiveCorrelations.map(c => (
                  <CorrelationBadge key={c.tag} correlation={c} />
                ))}
              </div>
            </div>
          )}
          
          {negativeCorrelations.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                Mood Drains
              </p>
              <div className="flex flex-wrap gap-2">
                {negativeCorrelations.map(c => (
                  <CorrelationBadge key={c.tag} correlation={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly Periods */}
      {periods.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Weekly Snapshots
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {periods.slice(0, 4).map((period, i) => (
              <PeriodCard key={i} period={period} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {moodData.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Start Tracking Your Mood
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Add mood ratings to your journal entries to see emotional patterns and insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default EmotionalTrends;
