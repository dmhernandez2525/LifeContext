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
import { STARTER_QUESTIONS } from '@/data/questions';
import { DEFAULT_CATEGORIES, PrivacyLevel } from '@lcc/types';

export default function QuestionsPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { settings, markQuestionAnswered, addRecordingTime } = useAppStore();

  // Real audio recording
  const recorder = useRecorder({});

  // Live transcription
  const transcription = useTranscription({});

  // Persist recordings
  const { save: saveRecording } = useSaveRecording();

  // UI state
  const [showTranscription, setShowTranscription] = useState(settings?.showLiveTranscription ?? false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [recordingData, setRecordingData] = useState<{
    blob: Blob;
    duration: number;
    waveform: number[];
  } | null>(null);

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
      setIsReviewing(false);
      setFinalTranscript('');
      setRecordingData(null);
      transcription.clearTranscript();
      await recorder.start();
      // Start live transcription if Web Speech API is available
      if (showTranscription && transcription.hasWebSpeech) {
        transcription.startLive();
      }
    } catch {
      // Recording failed to start
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await recorder.stop();
      const liveText = transcription.stopLive();
      
      // Don't save yet - go to review mode
      setFinalTranscript(transcription.transcript || liveText || '');
      setRecordingData({
        blob: result.blob,
        duration: result.duration,
        waveform: recorder.waveform,
      });
      setIsReviewing(true);
      setRecordingComplete(true);
    } catch {
      // Recording failed to stop
    }
  };

  const handleSaveRecording = async () => {
    try {
      if (!recordingData) return;

      addRecordingTime(Math.round(recordingData.duration));
      markQuestionAnswered(currentQuestion.id);
      
      // Save recording to IndexedDB with edited transcript
      const saved = await saveRecording({
        questionId: currentQuestion.id,
        audioBlob: recordingData.blob,
        duration: recordingData.duration,
        transcript: finalTranscript,
        waveformData: recordingData.waveform,
      });
      
      setIsReviewing(false);
    } catch {
      // Failed to save recording
    }
  };

  const handleNextQuestion = () => {
    setRecordingComplete(false);
    setIsReviewing(false);
    setFinalTranscript('');
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/app');
    }
  };

  const handleSkip = () => {
    setRecordingComplete(false);
    setIsReviewing(false);
    setFinalTranscript('');
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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/app')}
          className="inline-flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors min-h-[44px] -ml-2 px-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <span>{category?.icon}</span>
          <span className="hidden sm:inline">{category?.name || 'Questions'}</span>
          <span>•</span>
          <span>{currentQuestionIndex + 1}/{categoryQuestions.length}</span>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Question */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
            {currentQuestion.text}
          </h2>

          {currentQuestion.context && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 sm:mb-4">
              {currentQuestion.context}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
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
        <div className="p-4 sm:p-6">
          {isReviewing ? (
            // REVIEW SCREEN
            <div className="space-y-6">
                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                     <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                   </div>
                   <div>
                     <p className="font-medium text-blue-900 dark:text-blue-100">Recording captured</p>
                     <p className="text-sm text-blue-700 dark:text-blue-300">
                       {formatDuration(recordingData?.duration || 0)}
                     </p>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Review Transcript (Edit if needed)
                   </label>
                   <textarea
                     value={finalTranscript}
                     onChange={(e) => setFinalTranscript(e.target.value)}
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-40"
                     placeholder="Transcript will appear here..."
                   />
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                     Private: Your recordings and transcripts are encrypted and stored only on this device.
                   </p>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-3 pt-2">
                   <button
                     onClick={handleStartRecording}
                     className="flex-1 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[48px] order-2 sm:order-1"
                   >
                     Discard & Re-record
                   </button>
                   <button
                     onClick={handleSaveRecording}
                     className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm min-h-[48px] order-1 sm:order-2"
                   >
                     Save & Continue
                   </button>
                 </div>
            </div>
          ) : recordingComplete ? (
            // Recording complete state (AFTER SAVING)
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Answer Saved!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Duration: {formatDuration(recorder.duration)}
              </p>
              <div className="flex items-center justify-center space-x-3">
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
          <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleSkip}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium min-h-[44px] w-full sm:w-auto"
              >
                Skip for now
              </button>
              <button
                onClick={handleStartRecording}
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto min-h-[48px]"
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
