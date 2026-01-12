import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Mic, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  FileAudio,
  Trash2,
  Play,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, useProgress } from '@/store/app-store';
import { useRecentRecordings } from '@/hooks';
import { formatDuration, formatRelativeTime } from '@/lib/utils';
import { DEFAULT_CATEGORIES } from '@lcc/types';
import { SkeletonList } from '@/components/Skeleton';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useToast } from '@/components/Toast';
import { CreateCategoryModal, NewCategory } from '@/components/CreateCategoryModal';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import SearchBar from '@/components/SearchBar';

export default function DashboardPage() {
  const { totalRecordingTime, categories } = useAppStore();
  const { overallProgress, getCategoryProgress } = useProgress();
  const { recordings, getTranscript, isLoading: recordingsLoading, deleteRecording } = useRecentRecordings(5);
  const [expandedRecording, setExpandedRecording] = useState<string | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const toast = useToast();

  // Use default categories if none loaded
  const displayCategories = categories.length > 0 
    ? categories 
    : DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `cat-${i}` }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue building your life story
          </p>
        </div>
        <SearchBar compact className="hidden md:block" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallProgress.percentage}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Overall Progress
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(totalRecordingTime)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recording Time
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Mic className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallProgress.answeredQuestions}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Questions Answered
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              Ready to continue?
            </h2>
            <p className="text-white/80">
              Pick up where you left off or start a new category
            </p>
          </div>
          <Link
            to="/app/questions"
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2.5 font-medium transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>Continue</span>
          </Link>
        </div>
      </motion.div>

      {/* Suggested Questions */}
      <SuggestedQuestions />

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCategories.slice(0, 9).map((category, index) => {
            const progress = getCategoryProgress(category.id);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  to={`/app/questions/${category.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {progress.answered}/{progress.total || '?'} answered
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Create New Category Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * Math.min(9, displayCategories.length) }}
          >
            <button
              onClick={() => setShowCreateCategory(true)}
              className="w-full h-full min-h-[120px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium text-blue-600 dark:text-blue-400">
                Create Category
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add your own topics
              </p>
            </button>
          </motion.div>
        </div>

        {displayCategories.length > 9 && (
          <Link
            to="/app/questions"
            className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium mt-4 hover:underline"
          >
            <span>View all {displayCategories.length} categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Recent Recordings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Recordings
        </h2>
        {recordingsLoading ? (
          <SkeletonList count={3} />
        ) : recordings.length > 0 ? (
          <div className="space-y-3">
            {recordings.map((recording, index) => {
              const transcript = getTranscript(recording);
              return (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileAudio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDuration(Math.round(recording.duration))} recording
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(recording.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete recording"
                        onClick={async () => {
                          if (confirm('Delete this recording? This cannot be undone.')) {
                            const success = await deleteRecording(recording.id);
                            if (success) {
                              toast.success('Recording deleted');
                            } else {
                              toast.error('Failed to delete recording');
                            }
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Audio Player - shown when expanded */}
                  {expandedRecording === recording.id && recording.audioBlob && (
                    <div className="mt-3">
                      <AudioPlayer src={recording.audioBlob} compact />
                    </div>
                  )}
                  {transcript && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      "{transcript}"
                    </p>
                  )}
                  {/* Click to expand */}
                  {recording.audioBlob && (
                    <button
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => setExpandedRecording(
                        expandedRecording === recording.id ? null : recording.id
                      )}
                    >
                      {expandedRecording === recording.id ? 'Hide player' : 'Show player'}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recordings yet. Start answering questions to see your recordings here.
          </p>
        )}
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={showCreateCategory}
        onClose={() => setShowCreateCategory(false)}
        onSave={(newCategory: NewCategory) => {
          // In a full implementation, this would save to storage
          toast.success(`Created category: ${newCategory.name}`);
          setShowCreateCategory(false);
        }}
      />
    </div>
  );
}
