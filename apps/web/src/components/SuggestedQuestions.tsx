/**
 * SuggestedQuestions - Displays AI-suggested questions based on user context
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Target,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicQuestions, SuggestedQuestion } from '@/hooks/useDynamicQuestions';

const TYPE_ICONS = {
  'follow-up': Lightbulb,
  'gap-analysis': Target,
  'deepen': TrendingUp,
  'pattern-based': Sparkles,
};

const TYPE_COLORS = {
  'follow-up': 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
  'gap-analysis': 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  'deepen': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
  'pattern-based': 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30',
};

function QuestionCard({ question }: { question: SuggestedQuestion }) {
  const Icon = TYPE_ICONS[question.type];
  const colors = TYPE_COLORS[question.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
    >
      <div className="flex items-start space-x-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colors)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
            {question.text}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {question.reason}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {question.categoryName}
            </span>
            <Link
              to={`/app/questions/${question.categoryId}`}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span>Answer</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SuggestedQuestions() {
  const { suggestions, categoryGaps, isLoading } = useDynamicQuestions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Suggested For You
          </h2>
        </div>
        <div className="grid gap-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center space-x-3 mb-3">
          <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Start Your Journey
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Answer a few questions to unlock personalized suggestions based on your life story.
        </p>
        <Link
          to="/app/questions"
          className="inline-flex items-center space-x-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
        >
          <span>Start answering</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Suggested For You
          </h2>
        </div>
        {categoryGaps.length > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {categoryGaps.filter(g => g.percentage === 0).length} unexplored areas
          </span>
        )}
      </div>

      <div className="grid gap-3">
        {suggestions.slice(0, 4).map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <QuestionCard question={question} />
          </motion.div>
        ))}
      </div>

      {/* Category Gaps */}
      {categoryGaps.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Areas to explore:
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryGaps.slice(0, 5).map(gap => (
              <Link
                key={gap.categoryId}
                to={`/app/questions/${gap.categoryId}`}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span>{gap.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{gap.categoryName.split(' ')[0]}</span>
                <span className="text-gray-400 text-xs">({gap.percentage}%)</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestedQuestions;
