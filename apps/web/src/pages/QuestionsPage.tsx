import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Pause, 
  Play, 
  Square,
  ChevronLeft,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { useRecorder, useTranscription, useSaveRecording } from '@/hooks';
import Waveform from '@/components/Waveform';
import { PrivacyLevelSelector } from '@/components/PrivacyLevelSelector';
import { DEFAULT_CATEGORIES, PrivacyLevel, Question } from '@lcc/types';

// Starter questions database (50+ questions across categories)
const STARTER_QUESTIONS: Question[] = [
  // Early Life & Origins
  { id: 'el-1', categoryId: 'early-life', text: 'Tell me about where you were born and your earliest memories. What stands out most from your childhood?', context: 'Your origins establish the foundation of your life story.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'el-2', categoryId: 'early-life', text: 'Who were the most influential people in your early life? How did they shape who you became?', context: 'Early influences often define our values and perspectives.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'el-3', categoryId: 'early-life', text: 'What was your family dynamic like growing up? Describe the atmosphere of your home.', context: 'Family environment shapes our emotional development.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'el-4', categoryId: 'early-life', text: 'What were your favorite activities and interests as a child? Which ones have stayed with you?', context: 'Childhood interests often reveal our core passions.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 4, isFollowUp: false },

  // Family & Relationships
  { id: 'fr-1', categoryId: 'family', text: 'Describe your relationship with your parents. How has it evolved over time?', context: 'Parent relationships profoundly impact our attachment styles.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'fr-2', categoryId: 'family', text: 'Tell me about your siblings or closest childhood companions. What role did they play in your development?', context: 'Sibling and peer relationships shape social skills.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 2, isFollowUp: false },
  { id: 'fr-3', categoryId: 'family', text: 'What romantic relationships have been most significant in your life? What did you learn from each?', context: 'Romantic relationships teach us about love and ourselves.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'fr-4', categoryId: 'family', text: 'Who are your closest friends today? How did those friendships form?', context: 'Adult friendships reflect our evolved values.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 4, isFollowUp: false },

  // Values & Beliefs
  { id: 'vb-1', categoryId: 'values', text: 'What values are most important to you? Where do you think these values came from?', context: 'Core values guide our decisions and define our character.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'vb-2', categoryId: 'values', text: 'How have your spiritual or religious beliefs evolved throughout your life?', context: 'Spiritual development reflects our search for meaning.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'vb-3', categoryId: 'values', text: 'What do you believe is the meaning of life? How has this view changed over time?', context: 'Exploring life\'s meaning reveals deep personal philosophy.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'vb-4', categoryId: 'values', text: 'What ethical principles guide your decision-making? Can you give an example?', context: 'Ethics in action show our true values.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Career & Work
  { id: 'cw-1', categoryId: 'career', text: 'Walk me through your career journey. What pivotal decisions shaped your path?', context: 'Career paths reveal our ambitions and adaptability.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PROFESSIONAL, order: 1, isFollowUp: false },
  { id: 'cw-2', categoryId: 'career', text: 'What accomplishments are you most proud of professionally? Why do they matter to you?', context: 'Professional pride shows what we value in work.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PROFESSIONAL, order: 2, isFollowUp: false },
  { id: 'cw-3', categoryId: 'career', text: 'What was your biggest professional failure? How did you recover and what did you learn?', context: 'Failures often teach more than successes.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'cw-4', categoryId: 'career', text: 'What does work-life balance mean to you? How do you try to achieve it?', context: 'Balance reflects our priorities.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Dreams & Aspirations
  { id: 'da-1', categoryId: 'dreams', text: 'If you could accomplish anything in the next 10 years, what would it be?', context: 'Long-term dreams reveal our deepest desires.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'da-2', categoryId: 'dreams', text: 'What childhood dreams have you fulfilled? Which ones are still waiting?', context: 'Comparing dreams to reality shows growth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'da-3', categoryId: 'dreams', text: 'What legacy do you want to leave behind? How do you want to be remembered?', context: 'Legacy thinking clarifies what truly matters.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 3, isFollowUp: false },
  { id: 'da-4', categoryId: 'dreams', text: 'If money were no object, how would you spend your time?', context: 'Removing constraints reveals true passions.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Fears & Challenges
  { id: 'fc-1', categoryId: 'fears', text: 'What are you most afraid of? Where do you think this fear comes from?', context: 'Understanding fears helps overcome them.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'fc-2', categoryId: 'fears', text: 'What has been the most difficult period of your life? How did you get through it?', context: 'Resilience stories reveal our strength.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'fc-3', categoryId: 'fears', text: 'What limiting beliefs have held you back? Are you working to overcome any of them?', context: 'Limiting beliefs often hide growth opportunities.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'fc-4', categoryId: 'fears', text: 'How do you handle stress and anxiety? What coping mechanisms work for you?', context: 'Coping strategies are valuable self-knowledge.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Strengths & Skills
  { id: 'ss-1', categoryId: 'strengths', text: 'What are your greatest strengths? How have you developed them?', context: 'Recognizing strengths builds confidence.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'ss-2', categoryId: 'strengths', text: 'What skills have you mastered? Describe your journey from beginner to expert.', context: 'Skill development stories show dedication.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PROFESSIONAL, order: 2, isFollowUp: false },
  { id: 'ss-3', categoryId: 'strengths', text: 'What do others consistently come to you for help with?', context: 'What others seek shows our unique value.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'ss-4', categoryId: 'strengths', text: 'Describe a time when you surprised yourself with your own capabilities.', context: 'Surprises reveal hidden potential.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Weaknesses & Growth
  { id: 'wg-1', categoryId: 'weaknesses', text: 'What are your biggest weaknesses? How do they affect your life?', context: 'Honest weakness assessment enables growth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'wg-2', categoryId: 'weaknesses', text: 'What patterns keep repeating in your life that you wish would change?', context: 'Patterns reveal areas needing attention.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'wg-3', categoryId: 'weaknesses', text: 'What feedback have you received repeatedly that you struggle to accept?', context: 'Difficult feedback often holds truth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'wg-4', categoryId: 'weaknesses', text: 'What skill do you wish you had developed earlier in life?', context: 'Regrets can guide future priorities.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Hobbies & Interests
  { id: 'hi-1', categoryId: 'hobbies', text: 'What activities make you lose track of time? Why do you think they captivate you?', context: 'Flow states indicate deep passion.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 1, isFollowUp: false },
  { id: 'hi-2', categoryId: 'hobbies', text: 'What hobbies have you picked up and dropped over the years? What stuck?', context: 'Hobby patterns show evolving interests.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 2, isFollowUp: false },
  { id: 'hi-3', categoryId: 'hobbies', text: 'What would you like to learn if you had unlimited time?', context: 'Learning desires reveal curiosity areas.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'hi-4', categoryId: 'hobbies', text: 'How do you spend your ideal weekend?', context: 'Ideal time use shows true preferences.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.FRIENDS, order: 4, isFollowUp: false },

  // Health & Wellness
  { id: 'hw-1', categoryId: 'health', text: 'How has your relationship with your body and health evolved over the years?', context: 'Body relationship impacts overall wellbeing.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'hw-2', categoryId: 'health', text: 'What mental health challenges have you faced? How have you addressed them?', context: 'Mental health awareness is crucial for growth.', suggestedDuration: 25, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'hw-3', categoryId: 'health', text: 'What wellness practices have made the biggest difference in your life?', context: 'Effective practices are worth documenting.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'hw-4', categoryId: 'health', text: 'How do you define and maintain your energy levels?', context: 'Energy management affects all life areas.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Philosophy & Worldview
  { id: 'pw-1', categoryId: 'philosophy', text: 'How would you describe your overall philosophy of life in a few sentences?', context: 'Life philosophy guides daily decisions.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'pw-2', categoryId: 'philosophy', text: 'What books, ideas, or thinkers have most influenced your worldview?', context: 'Intellectual influences shape perspective.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'pw-3', categoryId: 'philosophy', text: 'How do you think about death and mortality? How does it affect how you live?', context: 'Mortality awareness can clarify priorities.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },
  { id: 'pw-4', categoryId: 'philosophy', text: 'What do you believe about human nature - are people fundamentally good?', context: 'Views on human nature affect relationships.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 4, isFollowUp: false },

  // Accomplishments
  { id: 'ac-1', categoryId: 'accomplishments', text: 'What achievement are you most proud of in your entire life?', context: 'Peak achievements reveal deep values.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'ac-2', categoryId: 'accomplishments', text: 'What obstacles did you overcome to achieve something meaningful?', context: 'Obstacle stories show resilience.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'ac-3', categoryId: 'accomplishments', text: 'What accomplishment surprised you the most?', context: 'Surprises reveal hidden potential.', suggestedDuration: 10, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 3, isFollowUp: false },

  // Regrets & Lessons
  { id: 'rl-1', categoryId: 'regrets', text: 'If you could go back and change one decision, what would it be and why?', context: 'Regrets often hold important lessons.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'rl-2', categoryId: 'regrets', text: 'What\'s the most important lesson life has taught you?', context: 'Life lessons are wisdom to preserve.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'rl-3', categoryId: 'regrets', text: 'What advice would you give your younger self?', context: 'Advice to self reveals growth.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 3, isFollowUp: false },

  // Legacy & Impact
  { id: 'li-1', categoryId: 'legacy', text: 'How do you want to be remembered by those who knew you?', context: 'Legacy desires clarify current priorities.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 1, isFollowUp: false },
  { id: 'li-2', categoryId: 'legacy', text: 'What impact do you hope to have on the world?', context: 'Impact goals drive meaningful action.', suggestedDuration: 15, defaultPrivacyLevel: PrivacyLevel.PRIVATE, order: 2, isFollowUp: false },
  { id: 'li-3', categoryId: 'legacy', text: 'What wisdom would you most want to pass on to future generations?', context: 'Wisdom preservation is a gift to the future.', suggestedDuration: 20, defaultPrivacyLevel: PrivacyLevel.FAMILY, order: 3, isFollowUp: false },
];

export default function QuestionsPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { settings, markQuestionAnswered, addRecordingTime } = useAppStore();

  // Real audio recording
  const recorder = useRecorder({
    onError: (error) => console.error('Recording error:', error),
  });

  // Live transcription
  const transcription = useTranscription({
    onFinalResult: (text) => console.log('Final:', text),
  });

  // Persist recordings
  const { save: saveRecording } = useSaveRecording();

  // UI state
  const [showTranscription, setShowTranscription] = useState(settings?.showLiveTranscription ?? false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);

  // Filter questions by category if specified
  const categoryQuestions = categorySlug
    ? STARTER_QUESTIONS.filter(q => q.categoryId === categorySlug)
    : STARTER_QUESTIONS.slice(0, 10); // Show first 10 for "all" view

  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const category = DEFAULT_CATEGORIES.find(c => c.slug === (categorySlug || currentQuestion?.categoryId));

  // Privacy level for current recording (defaults to question's default)
  const [selectedPrivacyLevel, setSelectedPrivacyLevel] = useState<PrivacyLevel>(
    currentQuestion?.defaultPrivacyLevel ?? PrivacyLevel.PRIVATE
  );

  const handleStartRecording = async () => {
    try {
      setRecordingComplete(false);
      transcription.clearTranscript();
      await recorder.start();
      // Start live transcription if Web Speech API is available
      if (showTranscription && transcription.hasWebSpeech) {
        transcription.startLive();
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await recorder.stop();
      const finalTranscript = transcription.stopLive();
      
      addRecordingTime(Math.round(result.duration));
      markQuestionAnswered(currentQuestion.id);
      setRecordingComplete(true);
      
      // Save recording to IndexedDB
      const saved = await saveRecording({
        questionId: currentQuestion.id,
        audioBlob: result.blob,
        duration: result.duration,
        transcript: transcription.transcript || finalTranscript,
        waveformData: recorder.waveform,
      });
      
      if (saved) {
        console.log('Recording saved:', saved.id, '- Duration:', Math.round(result.duration), 's');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleNextQuestion = () => {
    setRecordingComplete(false);
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/app');
    }
  };

  const handleSkip = () => {
    setRecordingComplete(false);
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/app');
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No questions available
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {categorySlug ? 'This category has no questions yet.' : 'Please select a category to get started.'}
        </p>
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  // Check permission state
  if (recorder.hasPermission === false) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Microphone Access Required
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          To record your answers, we need permission to access your microphone. 
          Your recordings are encrypted locally and never leave your device.
        </p>
        <button
          onClick={recorder.requestPermission}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Mic className="w-5 h-5" />
          <span>Allow Microphone Access</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{category?.icon}</span>
          <span>{category?.name || 'Questions'}</span>
          <span>•</span>
          <span>{currentQuestionIndex + 1} of {categoryQuestions.length}</span>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Question */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {currentQuestion.text}
          </h2>
          
          {currentQuestion.context && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {currentQuestion.context}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>~{currentQuestion.suggestedDuration} min</span>
            </div>
            <PrivacyLevelSelector
              value={selectedPrivacyLevel}
              onChange={setSelectedPrivacyLevel}
              compact
            />
          </div>
        </div>

        {/* Recording Interface */}
        <div className="p-6">
          {recordingComplete ? (
            // Recording complete state
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Answer Recorded!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Duration: {formatDuration(recorder.duration)}
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={handleStartRecording}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Re-record
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  Next Question
                </button>
              </div>
            </div>
          ) : recorder.status === 'idle' ? (
            // Ready to record
            <div className="text-center py-8">
              <button
                onClick={handleStartRecording}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transform"
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tap to start recording
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                💡 Tip: Don't worry about staying perfectly on topic. Let your thoughts flow naturally - you can always organize later.
              </p>
            </div>
          ) : (
            // Recording in progress
            <div className="space-y-6">
              {/* Recording indicator */}
              <div className="flex items-center justify-center space-x-3">
                <span className={cn(
                  'w-3 h-3 rounded-full',
                  recorder.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                )} />
                <span className="text-2xl font-mono font-semibold text-gray-900 dark:text-white">
                  {formatDuration(recorder.duration)}
                </span>
              </div>

              {/* Volume Indicator */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                  <motion.div 
                    className={cn(
                      "h-full transition-colors duration-300",
                      recorder.volume < 0.1 ? "bg-red-500" : recorder.volume < 0.3 ? "bg-yellow-500" : "bg-green-500"
                    )}
                    animate={{ width: `${Math.min(100, recorder.volume * 200)}%` }}
                  />
                </div>
                {recorder.volume < 0.1 && recorder.duration > 2 && recorder.status === 'recording' && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500 flex items-center space-x-1"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Voice too quiet - try speaking louder</span>
                  </motion.p>
                )}
                {recorder.volume >= 0.1 && recorder.status === 'recording' && (
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <Volume2 className="w-3 h-3" />
                    <span>Signal healthy</span>
                  </p>
                )}
              </div>

              {/* Waveform */}
              <Waveform
                data={recorder.waveform}
                isRecording={recorder.status === 'recording'}
                isPaused={recorder.status === 'paused'}
              />

              {/* Live transcription toggle */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setShowTranscription(!showTranscription)}
                  className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showTranscription ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>Live transcription {showTranscription ? 'on' : 'off'}</span>
                </button>
              </div>

              {/* Transcription preview */}
              {showTranscription && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-gray-600 dark:text-gray-400 text-sm max-h-32 overflow-y-auto">
                  {!transcription.hasWebSpeech ? (
                    <p className="italic text-yellow-600 dark:text-yellow-400">
                      ⚠️ Live transcription not available in this browser. Try Chrome.
                    </p>
                  ) : transcription.transcript || transcription.interimTranscript ? (
                    <p>
                      {transcription.transcript}
                      <span className="text-gray-400 dark:text-gray-500">
                        {transcription.interimTranscript}
                      </span>
                    </p>
                  ) : (
                    <p className="italic">Listening... speak to see your words here.</p>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                {recorder.status === 'paused' ? (
                  <button
                    onClick={recorder.resume}
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-colors"
                  >
                    <Play className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    onClick={recorder.pause}
                    className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-white transition-colors"
                  >
                    <Pause className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={handleStopRecording}
                  className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                >
                  <Square className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {recorder.status === 'idle' && !recordingComplete && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
              >
                Skip for now
              </button>
              <button
                onClick={handleStartRecording}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
