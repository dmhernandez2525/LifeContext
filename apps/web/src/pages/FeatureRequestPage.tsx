/**
 * FeatureRequestPage - Submit and vote on feature requests
 * Like Canny/ProductBoard but simpler
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send,
  Check,
  Clock,
  Wrench,
  X as XIcon,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data until Convex is connected
const MOCK_FEATURES = [
  {
    id: '1',
    title: 'Dark mode for mobile app',
    description: 'Add dark mode support to the upcoming mobile app for comfortable nighttime journaling.',
    category: 'feature',
    status: 'planned',
    upvotes: 127,
    downvotes: 3,
    comments: 14,
    createdAt: new Date('2026-01-05'),
  },
  {
    id: '2',
    title: 'Google Calendar integration',
    description: 'Sync life planning tasks with Google Calendar for due date reminders.',
    category: 'integration',
    status: 'in_progress',
    upvotes: 89,
    downvotes: 5,
    comments: 8,
    createdAt: new Date('2026-01-08'),
  },
  {
    id: '3',
    title: 'Voice-to-text transcription improvements',
    description: 'Improve accuracy of voice transcription, especially for accents and technical terms.',
    category: 'feature',
    status: 'pending',
    upvotes: 56,
    downvotes: 2,
    comments: 6,
    createdAt: new Date('2026-01-10'),
  },
  {
    id: '4',
    title: 'Multiple journal backup locations',
    description: 'Allow backups to multiple cloud providers simultaneously (Google Drive + Dropbox).',
    category: 'feature',
    status: 'completed',
    upvotes: 42,
    downvotes: 1,
    comments: 3,
    createdAt: new Date('2025-12-20'),
  },
];

const CATEGORIES = ['all', 'feature', 'integration', 'ui', 'bug', 'other'];
const STATUSES = ['all', 'pending', 'planned', 'in_progress', 'completed'];

const STATUS_CONFIG = {
  pending: { label: 'Under Review', icon: Clock, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
  planned: { label: 'Planned', icon: Lightbulb, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  in_progress: { label: 'In Progress', icon: Wrench, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  completed: { label: 'Completed', icon: Check, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
};

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; category: string; email?: string }) => void;
}

function SubmitModal({ isOpen, onClose, onSubmit }: SubmitModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('feature');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title, description, category, email: email || undefined });
    setTitle('');
    setDescription('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Submit Feature Request
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of your idea"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the feature in detail..."
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="feature">Feature</option>
              <option value="integration">Integration</option>
              <option value="ui">UI/UX</option>
              <option value="bug">Bug Report</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Get notified when status changes"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function FeatureRequestPage() {
  const [features, setFeatures] = useState(MOCK_FEATURES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [votedFeatures, setVotedFeatures] = useState<Record<string, 'up' | 'down' | null>>({});

  const filteredFeatures = features.filter(f => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && f.status !== selectedStatus) return false;
    return true;
  }).sort((a, b) => b.upvotes - a.upvotes);

  const handleVote = (featureId: string, voteType: 'up' | 'down') => {
    const currentVote = votedFeatures[featureId];
    
    setFeatures(prev => prev.map(f => {
      if (f.id !== featureId) return f;
      
      if (currentVote === voteType) {
        // Remove vote
        return {
          ...f,
          [voteType === 'up' ? 'upvotes' : 'downvotes']: f[voteType === 'up' ? 'upvotes' : 'downvotes'] - 1
        };
      } else if (currentVote) {
        // Switch vote
        return {
          ...f,
          upvotes: voteType === 'up' ? f.upvotes + 1 : f.upvotes - 1,
          downvotes: voteType === 'down' ? f.downvotes + 1 : f.downvotes - 1,
        };
      } else {
        // New vote
        return {
          ...f,
          [voteType === 'up' ? 'upvotes' : 'downvotes']: f[voteType === 'up' ? 'upvotes' : 'downvotes'] + 1
        };
      }
    }));

    setVotedFeatures(prev => ({
      ...prev,
      [featureId]: currentVote === voteType ? null : voteType
    }));
  };

  const handleSubmit = (data: { title: string; description: string; category: string }) => {
    const newFeature = {
      id: `new-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'pending' as const,
      upvotes: 1,
      downvotes: 0,
      comments: 0,
      createdAt: new Date(),
    };
    setFeatures(prev => [newFeature, ...prev]);
    setVotedFeatures(prev => ({ ...prev, [newFeature.id]: 'up' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Feature Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Help shape LifeContext by voting on features or submitting your own ideas. 
            Your voice matters.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1">
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors",
                    selectedCategory === cat
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Submit Idea
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors",
                selectedStatus === status
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
              )}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          {filteredFeatures.map(feature => {
            const status = STATUS_CONFIG[feature.status as keyof typeof STATUS_CONFIG];
            const myVote = votedFeatures[feature.id];
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleVote(feature.id, 'up')}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        myVote === 'up'
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {feature.upvotes - feature.downvotes}
                    </span>
                    <button
                      onClick={() => handleVote(feature.id, 'down')}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        myVote === 'down'
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1", status.color)}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{feature.category}</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {feature.comments}
                      </span>
                      <span>{feature.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No features found. Be the first to submit an idea!
            </p>
          </div>
        )}
      </div>

      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
