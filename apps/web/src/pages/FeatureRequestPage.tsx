/**
 * FeatureRequestPage - Submit and vote on feature requests.
 * Uses modular components and local fallback hook for demo mode.
 */
import { useState, useMemo } from 'react';
import { Lightbulb, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalFeatureRequests } from '@/hooks/useConvexFeatures';
import { FeatureCard, SubmitFeatureModal, FeatureDetailModal } from '@/components/features';
import type { Comment } from '@/components/features';

const CATEGORIES = ['all', 'feature', 'integration', 'ui', 'bug', 'other'];
const STATUSES = ['all', 'pending', 'planned', 'in_progress', 'completed'];

export default function FeatureRequestPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<Record<string, Comment[]>>({});

  const {
    features,
    submitFeature,
    voteOnFeature,
    getVoteStatus,
  } = useLocalFeatureRequests({ status: selectedStatus, category: selectedCategory });

  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return features;
    const lower = searchQuery.toLowerCase();
    return features.filter(f =>
      f.title.toLowerCase().includes(lower) ||
      f.description.toLowerCase().includes(lower)
    );
  }, [features, searchQuery]);

  const selectedFeature = useMemo(
    () => features.find(f => f._id === selectedFeatureId) ?? null,
    [features, selectedFeatureId]
  );

  const existingTitles = useMemo(() => features.map(f => f.title), [features]);

  const handleAddComment = (featureId: string, content: string, authorName?: string) => {
    const comment: Comment = {
      _id: `comment-${Date.now()}`,
      content,
      authorName,
      isAdmin: false,
      createdAt: Date.now(),
    };
    setLocalComments(prev => ({
      ...prev,
      [featureId]: [...(prev[featureId] ?? []), comment],
    }));
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

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Submit Idea
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''} found
        </p>

        {/* Feature List */}
        <div className="space-y-4">
          {filteredFeatures.map(feature => (
            <FeatureCard
              key={feature._id}
              feature={feature}
              voteStatus={getVoteStatus(feature._id)}
              onVote={voteOnFeature}
              onSelect={setSelectedFeatureId}
              commentCount={localComments[feature._id]?.length ?? 0}
            />
          ))}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No features match your search.' : 'No features found. Be the first to submit an idea!'}
            </p>
          </div>
        )}
      </div>

      <SubmitFeatureModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={submitFeature}
        existingTitles={existingTitles}
      />

      <FeatureDetailModal
        feature={selectedFeature}
        comments={selectedFeatureId ? (localComments[selectedFeatureId] ?? []) : []}
        voteStatus={selectedFeatureId ? getVoteStatus(selectedFeatureId) : null}
        onVote={voteOnFeature}
        onAddComment={handleAddComment}
        onClose={() => setSelectedFeatureId(null)}
      />
    </div>
  );
}
