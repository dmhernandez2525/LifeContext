import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Pause,
  Play,
  Square,
  ChevronLeft,
  Plus,
  Trash2,
  GripVertical,
  Check,
  Brain,
  Sparkles,
  Loader2,
  Volume2,
  VolumeX,
  Moon,
  MessageCircle,
  ArrowRight,
  RotateCcw,
  Save,
  AlertTriangle
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { useRecorder, useSynthesis, useTranscription, useWakeLock } from '@/hooks';
import Waveform from '@/components/Waveform';

interface BulletPoint {
  id: string;
  text: string;
}

interface ClarificationItem {
  question: string;
  answer: string;
}

type BrainDumpStep = 'bullets' | 'recording' | 'transcribing' | 'synthesizing' | 'clarification' | 'complete';

export default function BrainDumpPage() {
  const navigate = useNavigate();
  const { addRecordingTime } = useAppStore();

  // Brain dump state
  const [step, setStep] = useState<BrainDumpStep>('bullets');
  const [title, setTitle] = useState('');
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
    { id: '3', text: '' },
  ]);
  const [synthesis, setSynthesis] = useState<{
    organized: string;
    insights: string[];
    questions: string[];
    contradictions: Array<{
      statement1: string;
      statement2: string;
      context: string;
      resolutionQuestion: string;
    }>;
  } | null>(null);

  // Clarification state
  const [clarifications, setClarifications] = useState<ClarificationItem[]>([]);
  const [currentClarificationIndex, setCurrentClarificationIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Recording, transcription, and synthesis
  const recorder = useRecorder();
  const transcription = useTranscription();
  const { synthesize, hasApiKey } = useSynthesis();
  const wakeLock = useWakeLock();

  // Track final transcription
  const [finalTranscript, setFinalTranscript] = useState('');

  // Bullet point handlers
  const addBulletPoint = () => {
    setBulletPoints([
      ...bulletPoints,
      { id: Date.now().toString(), text: '' },
    ]);
  };

  const updateBulletPoint = (id: string, text: string) => {
    setBulletPoints(
      bulletPoints.map((bp) => (bp.id === id ? { ...bp, text } : bp))
    );
  };

  const removeBulletPoint = (id: string) => {
    if (bulletPoints.length > 1) {
      setBulletPoints(bulletPoints.filter((bp) => bp.id !== id));
    }
  };

  const filledBullets = bulletPoints.filter((bp) => bp.text.trim().length > 0);
  const canStartRecording = filledBullets.length >= 1;

  // Start recording phase with wake lock
  const handleStartRecording = async () => {
    setStep('recording');

    // Request wake lock to prevent screen timeout
    await wakeLock.request();

    // Start live transcription if available
    if (transcription.hasWebSpeech) {
      transcription.startLive();
    }

    await recorder.start();
  };

  // Complete recording and run transcription + synthesis
  const handleStopRecording = async () => {
    const result = await recorder.stop();
    addRecordingTime(Math.round(result.duration));

    // Release wake lock
    await wakeLock.release();

    // Stop live transcription and get result
    let transcript = '';
    if (transcription.hasWebSpeech) {
      transcript = transcription.stopLive();
    }

    // If we have an audio blob and Whisper API key, transcribe the audio
    if (result.blob && transcription.hasWhisperKey) {
      setStep('transcribing');
      try {
        const whisperResult = await transcription.transcribeBlob(result.blob);
        transcript = whisperResult.text;
      } catch {
        // Fall back to live transcription or demo
      }
    }

    // Use whatever transcript we have, or fall back to demo
    const finalText = transcript ||
      `I've been thinking about ${filledBullets.map(b => b.text).join(' and also about ')}. These topics are important to me because they reflect my values and goals.`;

    setFinalTranscript(finalText);
    setStep('synthesizing');

    try {
      const synthesisResult = await synthesize(
        filledBullets.map(b => b.text),
        finalText
      );

      setSynthesis({
        organized: synthesisResult.organizedContent,
        insights: synthesisResult.insights,
        questions: synthesisResult.questions,
        contradictions: synthesisResult.contradictions || [],
      });

      // If there are questions or contradictions, go to clarification step
      const allQuestions = [
        ...synthesisResult.questions,
        ...(synthesisResult.contradictions || []).map(c => c.resolutionQuestion),
      ];

      if (allQuestions.length > 0) {
        setClarifications(allQuestions.map(q => ({ question: q, answer: '' })));
        setCurrentClarificationIndex(0);
        setStep('clarification');
      } else {
        setStep('complete');
      }
    } catch (error) {
      console.error('Synthesis failed:', error);
      setSynthesis({
        organized: `Your thoughts about: ${filledBullets.map(b => b.text).join(', ')}`,
        insights: ['Synthesis encountered an issue. Try again with an API key in Settings.'],
        questions: ['Would you like to explore these topics further?'],
        contradictions: [],
      });
      setStep('complete');
    }
  };

  // Handle answering clarification questions
  const handleAnswerClarification = () => {
    if (!currentAnswer.trim()) return;

    const updated = [...clarifications];
    updated[currentClarificationIndex].answer = currentAnswer;
    setClarifications(updated);
    setCurrentAnswer('');

    if (currentClarificationIndex < clarifications.length - 1) {
      setCurrentClarificationIndex(currentClarificationIndex + 1);
    } else {
      // All questions answered, re-synthesize with clarifications
      handleResynthesizeWithClarifications();
    }
  };

  const handleSkipClarification = () => {
    if (currentClarificationIndex < clarifications.length - 1) {
      setCurrentClarificationIndex(currentClarificationIndex + 1);
    } else {
      setStep('complete');
    }
  };

  // Re-synthesize with clarification answers
  const handleResynthesizeWithClarifications = async () => {
    setStep('synthesizing');

    // Build enhanced transcript with clarifications
    const clarificationContext = clarifications
      .filter(c => c.answer.trim())
      .map(c => `Q: ${c.question}\nA: ${c.answer}`)
      .join('\n\n');

    const enhancedTranscript = `${finalTranscript}\n\n--- Clarifications ---\n${clarificationContext}`;

    try {
      const result = await synthesize(
        filledBullets.map(b => b.text),
        enhancedTranscript
      );

      setSynthesis({
        organized: result.organizedContent,
        insights: result.insights,
        questions: [],
        contradictions: [],
      });
      setStep('complete');
    } catch {
      setStep('complete');
    }
  };

  // Reset for new brain dump
  const handleReset = () => {
    setStep('bullets');
    setBulletPoints([{ id: '1', text: '' }, { id: '2', text: '' }, { id: '3', text: '' }]);
    setTitle('');
    setSynthesis(null);
    setClarifications([]);
    setCurrentClarificationIndex(0);
    setCurrentAnswer('');
    setFinalTranscript('');
    transcription.clearTranscript();
  };

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      wakeLock.release();
    };
  }, []);

  // Render based on step
  const renderStep = () => {
    switch (step) {
      case 'bullets':
        return (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What's on your mind? (optional title)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Thoughts about my career path..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bullet points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Anchor points (jot down topics you want to cover)
              </label>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {bulletPoints.map((bp, index) => (
                    <motion.div
                      key={bp.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-5">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        value={bp.text}
                        onChange={(e) => updateBulletPoint(bp.id, e.target.value)}
                        placeholder="Add a topic or thought..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      {bulletPoints.length > 1 && (
                        <button
                          onClick={() => removeBulletPoint(bp.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                onClick={addBulletPoint}
                className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 mt-2 hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>Add another point</span>
              </button>
            </div>

            {/* Tip */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>How Brain Dump works:</strong> Jot down quick topics, then talk through them freely.
                AI will organize your thoughts, find contradictions, and generate qualifying questions.
              </p>
              {wakeLock.isSupported && (
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2 flex items-center space-x-1">
                  <Moon className="w-3 h-3" />
                  <span>Screen will stay on during recording.</span>
                </p>
              )}
              {!hasApiKey && (
                <p className="text-xs text-amber-600 dark:text-amber-300 mt-2 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Add your Anthropic API key in Settings for enhanced AI synthesis.</span>
                </p>
              )}
            </div>

            {/* Start button */}
            <button
              onClick={handleStartRecording}
              disabled={!canStartRecording}
              className={cn(
                'w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2',
                canStartRecording
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              )}
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          </div>
        );

      case 'recording':
        return (
          <div className="space-y-6">
            {/* Wake lock indicator */}
            {wakeLock.isLocked && (
              <div className="flex items-center justify-center space-x-2 text-xs text-green-600 dark:text-green-400">
                <Moon className="w-3 h-3" />
                <span>Screen will stay on</span>
              </div>
            )}

            {/* Bullet reminders */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your anchor points:
              </p>
              <ul className="space-y-1">
                {filledBullets.map((bp, i) => (
                  <li key={bp.id} className="text-sm text-gray-600 dark:text-gray-400">
                    {i + 1}. {bp.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recording status */}
            <div className="text-center py-4">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className={cn(
                  'w-3 h-3 rounded-full',
                  recorder.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                )} />
                <span className="text-3xl font-mono font-semibold text-gray-900 dark:text-white">
                  {formatDuration(recorder.duration)}
                </span>
              </div>

              {/* Volume Indicator */}
              <div className="flex flex-col items-center space-y-2 mb-4">
                <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex mx-auto">
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
                    className="text-xs text-red-500 flex items-center justify-center space-x-1"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Voice too quiet - try speaking louder</span>
                  </motion.p>
                )}
                {recorder.volume >= 0.1 && recorder.status === 'recording' && (
                  <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                    <Volume2 className="w-3 h-3" />
                    <span>Signal healthy</span>
                  </p>
                )}
              </div>

              <Waveform
                data={recorder.waveform}
                isRecording={recorder.status === 'recording'}
                isPaused={recorder.status === 'paused'}
              />

              {/* Live transcription preview */}
              {transcription.hasWebSpeech && (transcription.transcript || transcription.interimTranscript) && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-h-32 overflow-y-auto">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Live transcription:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {transcription.transcript}
                    <span className="text-gray-400">{transcription.interimTranscript}</span>
                  </p>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Speak freely about your topics. Take your time.
              </p>
            </div>

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
        );

      case 'transcribing':
        return (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Transcribing your audio...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Converting speech to text with Whisper AI
            </p>
          </div>
        );

      case 'synthesizing':
        return (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Synthesizing your thoughts...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI is organizing your ideas and finding patterns
            </p>
          </div>
        );

      case 'clarification': {
        const currentQuestion = clarifications[currentClarificationIndex];
        const progress = ((currentClarificationIndex + 1) / clarifications.length) * 100;

        return (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Clarification {currentClarificationIndex + 1} of {clarifications.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-1">AI wants to clarify:</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {currentQuestion?.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer input */}
            <div>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Your answer..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkipClarification}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleAnswerClarification}
                disabled={!currentAnswer.trim()}
                className={cn(
                  'flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2',
                  currentAnswer.trim()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                )}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      }

      case 'complete':
        return (
          <div className="space-y-6">
            {/* Session info */}
            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <Brain className="w-4 h-4" />
              <span>{formatDuration(recorder.duration)} recorded</span>
              <span>•</span>
              <span>{filledBullets.length} topics covered</span>
              {clarifications.filter(c => c.answer).length > 0 && (
                <>
                  <span>•</span>
                  <span>{clarifications.filter(c => c.answer).length} clarifications</span>
                </>
              )}
            </div>

            {/* Organized content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>Organized Thoughts</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                {synthesis?.organized}
              </p>
            </div>

            {/* Insights */}
            {synthesis?.insights && synthesis.insights.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-5">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                  Key Insights
                </h3>
                <ul className="space-y-2">
                  {synthesis.insights.map((insight, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-purple-800 dark:text-purple-200">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contradictions found */}
            {synthesis?.contradictions && synthesis.contradictions.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Potential Contradictions</span>
                </h3>
                <ul className="space-y-3">
                  {synthesis.contradictions.map((c, i) => (
                    <li key={i} className="text-sm text-amber-800 dark:text-amber-200">
                      <p className="italic">"{c.statement1}"</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 my-1">vs</p>
                      <p className="italic">"{c.statement2}"</p>
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{c.context}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Remaining questions (if any skipped) */}
            {synthesis?.questions && synthesis.questions.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Questions to Explore Later
                </h3>
                <ul className="space-y-2">
                  {synthesis.questions.map((q, i) => (
                    <li key={i} className="text-sm text-blue-800 dark:text-blue-200">
                      {i + 1}. {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clarification answers summary */}
            {clarifications.filter(c => c.answer).length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-5">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  Your Clarifications
                </h3>
                <ul className="space-y-3">
                  {clarifications.filter(c => c.answer).map((c, i) => (
                    <li key={i} className="text-sm">
                      <p className="text-green-700 dark:text-green-300 font-medium">Q: {c.question}</p>
                      <p className="text-green-800 dark:text-green-200 mt-1">A: {c.answer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Brain Dump</span>
              </button>
              <button
                onClick={() => navigate('/app')}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-gray-900 dark:text-white">Brain Dump</span>
        </div>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
