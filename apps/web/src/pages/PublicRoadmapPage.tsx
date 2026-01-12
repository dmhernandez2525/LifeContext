/**
 * PublicRoadmapPage - Public roadmap showing planned features
 * Displays features by status: Planned, In Progress, Completed
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Wrench, 
  Check, 
  ThumbsUp,
  ChevronRight,
  Calendar,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock roadmap data
const ROADMAP_DATA = {
  planned: [
    { id: '1', title: 'Mobile App (iOS & Android)', description: 'Native mobile app with offline-first sync', upvotes: 234, quarter: 'Q2 2026' },
    { id: '2', title: 'Google Calendar Integration', description: 'Sync life planning tasks with Google Calendar', upvotes: 89, quarter: 'Q1 2026' },
    { id: '3', title: 'Family Sharing', description: 'Share specific journals with family members', upvotes: 67, quarter: 'Q2 2026' },
    { id: '4', title: 'Advanced AI Insights', description: 'GPT-4 powered pattern recognition and suggestions', upvotes: 112, quarter: 'Q1 2026' },
  ],
  in_progress: [
    { id: '5', title: 'Data Reclamation', description: 'Export your data from major platforms', upvotes: 156, progress: 75 },
    { id: '6', title: 'Life Planning Kanban', description: 'Visual task management for life goals', upvotes: 98, progress: 90 },
    { id: '7', title: 'Onboarding Wizard', description: 'Guided setup for new users', upvotes: 45, progress: 85 },
  ],
  completed: [
    { id: '8', title: 'Daily Journaling', description: 'Voice, video, and text journal entries', upvotes: 189, completedDate: '2026-01-11' },
    { id: '9', title: 'Emergency Access', description: 'Dead man\'s switch with Shamir\'s Secret Sharing', upvotes: 78, completedDate: '2026-01-10' },
    { id: '10', title: 'Cloud Backup', description: 'Google Drive and OneDrive backup support', upvotes: 134, completedDate: '2026-01-11' },
    { id: '11', title: 'Brain Dump Mode', description: 'Quick voice dump with AI synthesis', upvotes: 92, completedDate: '2026-01-10' },
  ],
};

const COLUMN_CONFIG = {
  planned: { label: 'Planned', icon: Lightbulb, color: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-50', bgDark: 'dark:bg-blue-900/20' },
  in_progress: { label: 'In Progress', icon: Wrench, color: 'from-yellow-500 to-orange-500', bgLight: 'bg-yellow-50', bgDark: 'dark:bg-yellow-900/20' },
  completed: { label: 'Completed', icon: Check, color: 'from-green-500 to-emerald-500', bgLight: 'bg-green-50', bgDark: 'dark:bg-green-900/20' },
};

type ColumnKey = keyof typeof ROADMAP_DATA;

export default function PublicRoadmapPage() {
  const [selectedColumn, setSelectedColumn] = useState<ColumnKey | 'all'>('all');

  const renderColumn = (key: ColumnKey) => {
    const config = COLUMN_CONFIG[key];
    const items = ROADMAP_DATA[key];

    return (
      <div className="flex-1 min-w-[300px]">
        {/* Column Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", config.color)}>
            <config.icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">{config.label}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} items</p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn("p-4 rounded-xl border border-gray-200 dark:border-gray-700", config.bgLight, config.bgDark)}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.upvotes}</span>
                </div>
                
                {'quarter' in item && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{item.quarter}</span>
                  </div>
                )}
                
                {'progress' in item && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.progress}%</span>
                  </div>
                )}
                
                {'completedDate' in item && (
                  <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    <span>{new Date(item.completedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Public Roadmap
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            What We're Building
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
          >
            See what's planned, in progress, and recently shipped. 
            Vote on features to help us prioritize.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/feature-request"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              <Lightbulb className="w-5 h-5" />
              Submit Feature Request
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Column Selector */}
        <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedColumn('all')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
              selectedColumn === 'all'
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            )}
          >
            All
          </button>
          {(Object.keys(COLUMN_CONFIG) as ColumnKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSelectedColumn(key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
                selectedColumn === key
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
            >
              {COLUMN_CONFIG[key].label}
            </button>
          ))}
        </div>

        {/* Columns */}
        <div className="flex gap-6 overflow-x-auto pb-4 lg:overflow-visible">
          {(Object.keys(COLUMN_CONFIG) as ColumnKey[]).map(key => (
            <div 
              key={key}
              className={cn(
                "lg:block",
                selectedColumn !== 'all' && selectedColumn !== key && "hidden lg:block"
              )}
            >
              {renderColumn(key)}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {ROADMAP_DATA.planned.length + ROADMAP_DATA.in_progress.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Features Coming</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-green-600">{ROADMAP_DATA.completed.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Recently Shipped</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-purple-600">500+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">User Votes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-600">2 weeks</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Ship Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
