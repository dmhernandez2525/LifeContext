/**
 * CreateQuestionModal - Modal for adding custom questions to categories
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { PrivacyLevel, QuestionCategory } from '@lcc/types';
import { PrivacyLevelSelector } from './PrivacyLevelSelector';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: NewQuestion) => void;
  category: QuestionCategory | null;
  onSuggestQuestions?: () => Promise<string[]>;
}

export interface NewQuestion {
  text: string;
  context: string;
  suggestedDuration: number;
  privacyLevel: PrivacyLevel;
  categoryId: string;
}

const DURATION_OPTIONS = [5, 10, 15, 20, 25, 30];

export function CreateQuestionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  category,
  onSuggestQuestions 
}: CreateQuestionModalProps) {
  const [text, setText] = useState('');
  const [context, setContext] = useState('');
  const [duration, setDuration] = useState(15);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.PRIVATE);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSave = () => {
    if (!text.trim()) {
      setError('Question text is required');
      return;
    }
    if (text.trim().length < 10) {
      setError('Question should be at least 10 characters');
      return;
    }
    if (!category) {
      setError('No category selected');
      return;
    }

    onSave({
      text: text.trim(),
      context: context.trim(),
      suggestedDuration: duration,
      privacyLevel,
      categoryId: category.id,
    });

    // Reset form
    setText('');
    setContext('');
    setDuration(15);
    setPrivacyLevel(PrivacyLevel.PRIVATE);
    setError('');
    setSuggestions([]);
    onClose();
  };

  const handleGenerateSuggestions = async () => {
    if (!onSuggestQuestions) return;
    
    setIsGenerating(true);
    try {
      const suggested = await onSuggestQuestions();
      setSuggestions(suggested);
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setText(suggestion);
    setSuggestions([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Add Question
                    </h2>
                    {category && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.icon} {category.name}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                {/* AI Suggestions */}
                {onSuggestQuestions && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          AI Suggestions
                        </span>
                      </div>
                      <button
                        onClick={handleGenerateSuggestions}
                        disabled={isGenerating}
                        className="text-xs px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-md font-medium transition-colors"
                      >
                        {isGenerating ? (
                          <span className="flex items-center space-x-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Generating...</span>
                          </span>
                        ) : (
                          'Generate Ideas'
                        )}
                      </button>
                    </div>
                    
                    {suggestions.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleUseSuggestion(s)}
                            className="w-full text-left text-sm p-2 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Question
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setError('');
                    }}
                    placeholder="What would you like to explore about yourself?"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                </div>

                {/* Context */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Context <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Why is this question valuable?"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suggested Duration
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          duration === d
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Level */}
                <PrivacyLevelSelector
                  value={privacyLevel}
                  onChange={setPrivacyLevel}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                >
                  Add Question
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CreateQuestionModal;
