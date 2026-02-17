/**
 * FeatureDetailModal - Detailed view of a feature request with comments.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X as XIcon,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Clock,
  Lightbulb,
  Wrench,
  Check,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeatureRequest } from '@/hooks/useConvexFeatures';

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: 'Under Review', icon: Clock, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
  planned: { label: 'Planned', icon: Lightbulb, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  in_progress: { label: 'In Progress', icon: Wrench, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  completed: { label: 'Completed', icon: Check, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
};

export interface Comment {
  _id: string;
  content: string;
  authorName?: string;
  isAdmin: boolean;
  createdAt: number;
}

interface FeatureDetailModalProps {
  feature: FeatureRequest | null;
  comments: Comment[];
  voteStatus: 'up' | 'down' | null;
  onVote: (featureId: string, voteType: 'up' | 'down') => void;
  onAddComment: (featureId: string, content: string, authorName?: string) => void;
  onClose: () => void;
}

export function FeatureDetailModal({
  feature,
  comments,
  voteStatus,
  onVote,
  onAddComment,
  onClose,
}: FeatureDetailModalProps) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  if (!feature) return null;

  const status = STATUS_CONFIG[feature.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(feature._id, commentText, authorName || undefined);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1", status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
                <span className="text-xs text-gray-400 capitalize">{feature.category}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-wrap">
            {feature.description}
          </p>

          {/* Voting */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => onVote(feature._id, 'up')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                voteStatus === 'up'
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="font-medium">{feature.upvotes}</span>
            </button>
            <button
              onClick={() => onVote(feature._id, 'down')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                voteStatus === 'down'
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="font-medium">{feature.downvotes}</span>
            </button>
            <span className="text-sm text-gray-400 ml-auto">
              Submitted {new Date(feature.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Comments */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4" />
              Comments ({comments.length})
            </h3>

            {comments.length === 0 ? (
              <p className="text-gray-400 text-sm">No comments yet. Be the first to share your thoughts.</p>
            ) : (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div
                    key={comment._id}
                    className={cn(
                      "p-3 rounded-lg",
                      comment.isAdmin
                        ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                        : "bg-gray-50 dark:bg-gray-800"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {comment.authorName ?? 'Anonymous'}
                        {comment.isAdmin && (
                          <span className="ml-1 text-xs text-purple-600 dark:text-purple-400">(Team)</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
