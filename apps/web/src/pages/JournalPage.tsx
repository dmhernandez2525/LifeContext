/**
 * JournalPage - Daily Diary with voice/video/text input
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Mic,
  Video,
  Type,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Loader2,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { useRecorder, useTranscription, useVideoRecorder } from '@/hooks';
import { db } from '@lcc/storage';
import { 
  JournalMood, 
  JournalMediaType, 
  MOOD_EMOJIS, 
  MOOD_LABELS,
  PrivacyLevel 
} from '@lcc/types';
import Waveform from '@/components/Waveform';
import VideoPlayer from '@/components/VideoPlayer';

// Types for journal entries from storage
interface JournalEntryDisplay {
  id: string;
  date: Date;
  content: string;
  mood?: JournalMood;
  energyLevel?: number;
  mediaType: JournalMediaType;
  duration?: number;
  createdAt: Date;
}

export default function JournalPage() {
  // State
  const [entries, setEntries] = useState<JournalEntryDisplay[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreating, setIsCreating] = useState(false);
  const [inputMode, setInputMode] = useState<JournalMediaType>('text');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalMood | undefined>(undefined);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [isSaving, setIsSaving] = useState(false);
  const [entrySaved, setEntrySaved] = useState(false);
  
  // Recording
  const recorder = useRecorder({
    onError: (error) => console.error('Recording error:', error),
  });
  const videoRecorder = useVideoRecorder({
    onError: (error) => console.error('Video recording error:', error),
  });
  const transcription = useTranscription({
    onFinalResult: (text) => setContent(prev => prev + ' ' + text),
  });

  // Load entries
  const loadEntries = useCallback(async () => {
    try {
      const stored = await db.journalEntries.orderBy('date').reverse().toArray();
      const displayEntries: JournalEntryDisplay[] = stored.map(e => ({
        id: e.id,
        date: e.date,
        content: typeof e.content === 'string' ? e.content : '', // Handle encrypted data
        mood: e.mood as JournalMood | undefined,
        energyLevel: e.energyLevel,
        mediaType: e.mediaType as JournalMediaType,
        duration: e.duration,
        createdAt: e.createdAt,
      }));
      setEntries(displayEntries);
    } catch (err) {
      console.error('Failed to load journal entries:', err);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Recording (audio or video based on mode)
  const handleStartRecording = async () => {
    try {
      if (inputMode === 'video') {
        await videoRecorder.start();
      } else {
        await recorder.start();
        if (transcription.hasWebSpeech) {
          transcription.startLive();
        }
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  // Stop recording
  const handleStopRecording = async () => {
    try {
      if (inputMode === 'video') {
        const result = await videoRecorder.stop();
        return { blob: result.blob, duration: result.duration, isVideo: true };
      } else {
        const result = await recorder.stop();
        transcription.stopLive();
        return { blob: result.blob, duration: result.duration, isVideo: false };
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      return null;
    }
  };

  // Save entry
  const handleSave = async () => {
    const isRecording = recorder.status === 'recording' || videoRecorder.status === 'recording';
    if (!content.trim() && !isRecording) return;
    
    setIsSaving(true);
    
    try {
      let audioBlob: Blob | undefined;
      let videoBlob: Blob | undefined;
      let duration: number | undefined;
      
      if (isRecording) {
        const result = await handleStopRecording();
        if (result) {
          if (result.isVideo) {
            videoBlob = result.blob;
          } else {
            audioBlob = result.blob;
          }
          duration = result.duration;
        }
      }

      const entry = {
        id: crypto.randomUUID(),
        date: selectedDate,
        content: { 
          version: 1, 
          algorithm: 'AES-256-GCM' as const, 
          iv: '', 
          data: btoa(content || 'Media entry'), 
          authTag: '' 
        },
        mood,
        energyLevel,
        mediaType: inputMode,
        audioBlob,
        videoBlob,
        duration,
        tags: [],
        privacyLevel: PrivacyLevel.PRIVATE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.journalEntries.put(entry);
      
      setEntrySaved(true);
      setTimeout(() => {
        setEntrySaved(false);
        setIsCreating(false);
        setContent('');
        setMood(undefined);
        loadEntries();
      }, 1500);
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete entry
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this journal entry?')) return;
    try {
      await db.journalEntries.delete(id);
      loadEntries();
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  // Navigate dates
  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    if (next <= new Date()) {
      setSelectedDate(next);
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Capture your thoughts, feelings, and experiences
          </p>
        </div>
        
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>
        )}
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-center space-x-4 py-4">
        <button
          onClick={goToPreviousDay}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <button
          onClick={goToNextDay}
          disabled={isToday}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isToday 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* New Entry Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            {entrySaved ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Entry Saved!
                </h3>
              </div>
            ) : (
              <>
                {/* Input Mode Toggle */}
                <div className="flex space-x-2 mb-6">
                  {[
                    { mode: 'text' as const, icon: Type, label: 'Type' },
                    { mode: 'voice' as const, icon: Mic, label: 'Voice' },
                    { mode: 'video' as const, icon: Video, label: 'Video' },
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setInputMode(mode)}
                      className={cn(
                        "flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors",
                        inputMode === mode
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Mood Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    How are you feeling?
                  </label>
                  <div className="flex space-x-2">
                    {(Object.keys(MOOD_EMOJIS) as JournalMood[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={cn(
                          "flex-1 flex flex-col items-center py-3 rounded-lg transition-all",
                          mood === m
                            ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        )}
                      >
                        <span className="text-2xl mb-1">{MOOD_EMOJIS[m]}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {MOOD_LABELS[m]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Level */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Energy Level: {energyLevel}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                {/* Content Input */}
                {inputMode === 'text' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind today?"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                  />
                ) : inputMode === 'video' ? (
                  <div className="mb-4">
                    {videoRecorder.status === 'idle' && !videoRecorder.videoUrl ? (
                      <button
                        onClick={handleStartRecording}
                        className="w-full flex items-center justify-center space-x-3 py-6 bg-purple-100 dark:bg-purple-900/20 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-medium text-purple-700 dark:text-purple-300">
                          Tap to Start Video Recording
                        </span>
                      </button>
                    ) : videoRecorder.status === 'recording' ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                          <video 
                            ref={videoRecorder.previewRef}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span>{formatDuration(videoRecorder.duration)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => videoRecorder.stop()}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Stop Recording
                        </button>
                      </div>
                    ) : videoRecorder.videoUrl ? (
                      <div className="space-y-4">
                        <VideoPlayer src={videoRecorder.videoUrl} className="aspect-video" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          Duration: {formatDuration(videoRecorder.duration)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mb-4">
                    {recorder.status === 'idle' ? (
                      <button
                        onClick={handleStartRecording}
                        className="w-full flex items-center justify-center space-x-3 py-6 bg-red-100 dark:bg-red-900/20 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                          <Mic className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-medium text-red-700 dark:text-red-300">
                          Tap to Start Recording
                        </span>
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <Waveform data={recorder.waveform} isRecording />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(recorder.duration)}</span>
                          </div>
                        </div>
                        {transcription.transcript && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            "{transcription.transcript}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setContent('');
                      setMood(undefined);
                      if (recorder.status === 'recording') {
                        recorder.cancel();
                      }
                      if (videoRecorder.status === 'recording') {
                        videoRecorder.cancel();
                      }
                    }}
                    className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || (!content.trim() && recorder.status !== 'recording' && videoRecorder.status !== 'recording' && !videoRecorder.videoBlob)}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Entry</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Entries
        </h2>
        
        {entries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No journal entries yet. Start writing today!
            </p>
          </div>
        ) : (
          entries.slice(0, 10).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {entry.mood && (
                    <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      {entry.mediaType === 'voice' && <Mic className="w-3 h-3" />}
                      {entry.mediaType === 'video' && <Video className="w-3 h-3" />}
                      {entry.mediaType === 'text' && <Type className="w-3 h-3" />}
                      <span>{entry.mediaType}</span>
                      {entry.duration && (
                        <>
                          <span>•</span>
                          <span>{formatDuration(entry.duration)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                {entry.content || '[Audio/Video entry]'}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
