/**
 * LifePlanningPage - Kanban board for life goal management
 * "Where do you see yourself in 10 years?"
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Calendar, 
  Brain, 
  Sparkles,
  Plus,
  Mic,
  X
} from 'lucide-react';
import KanbanBoard, { KanbanTask } from '@/components/kanban/KanbanBoard';
import { DEMO_TASKS, TASK_CATEGORIES, Task } from '@/data/demo-tasks';
import { useRecorder, useTranscription } from '@/hooks';
import Waveform from '@/components/Waveform';

// Convert demo tasks to KanbanTask format
const convertToKanbanTasks = (): KanbanTask[] => {
  return DEMO_TASKS.map((task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as KanbanTask['status'],
    priority: task.priority === 'P0' ? 'urgent' : task.priority === 'P1' ? 'high' : task.priority === 'P2' ? 'medium' : 'low' as KanbanTask['priority'],
    dueDate: task.dueDate || undefined,
    tags: task.tags,
    categoryId: task.category,
    subtasks: task.subtasks?.map((s, i: number) => ({
      id: `${task.id}-sub-${i}`,
      title: s.title,
      completed: s.done
    })),
    createdAt: task.createdAt,
    updatedAt: task.createdAt,
    // Note: In a real implementation we would link audioRecordings here
  }));
};

type TimelineView = 'week' | 'month' | 'year' | 'life';

export default function LifePlanningPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [timelineView, setTimelineView] = useState<TimelineView>('year');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  
  // Deep Dive Modal State
  const [activeSuggestion, setActiveSuggestion] = useState<{ type: string; text: string; taskTitle: string } | null>(null);
  const [deepDiveMode, setDeepDiveMode] = useState<'initial' | 'recording' | 'review'>('initial');
  const [deepDiveTranscript, setDeepDiveTranscript] = useState('');
  
  // Recording hooks
  const recorder = useRecorder({
    onError: (err) => console.error('Recorder error', err)
  });
  const transcription = useTranscription({
      onFinalResult: (text) => setDeepDiveTranscript(prev => prev + ' ' + text)
  });

  useEffect(() => {
    // Load demo tasks
    setTasks(convertToKanbanTasks());
  }, []);

  const handleTaskCreate = (taskData: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: KanbanTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    if (confirm('Delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const getTimelineFilteredTasks = () => {
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const oneYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    let timeFiltered = tasks;

    if (timelineView === 'week') {
      timeFiltered = tasks.filter(t => t.dueDate && new Date(t.dueDate) <= oneWeek);
    } else if (timelineView === 'month') {
      timeFiltered = tasks.filter(t => t.dueDate && new Date(t.dueDate) <= oneMonth);
    } else if (timelineView === 'year') {
      timeFiltered = tasks.filter(t => t.dueDate && new Date(t.dueDate) <= oneYear);
    } 
    // 'life' shows everything (plus the timeline visualization at bottom)

    if (selectedCategory === 'all') return timeFiltered;
    return timeFiltered.filter(t => t.categoryId === selectedCategory);
  };

  const filteredTasks = getTimelineFilteredTasks();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  // Deep Dive Handlers
  const startDeepDiveRecording = async () => {
      setDeepDiveMode('recording');
      setDeepDiveTranscript('');
      transcription.clearTranscript();
      await recorder.start();
      if (transcription.hasWebSpeech) transcription.startLive();
  };

  const stopDeepDiveRecording = async () => {
      await recorder.stop();
      transcription.stopLive();
      const text = transcription.transcript || '';
      setDeepDiveTranscript(prev => (prev + ' ' + text).trim());
      setDeepDiveMode('review');
  };

  const createFromSuggestion = (finalTitle: string, description: string) => {
      handleTaskCreate({
          title: finalTitle,
          description: description,
          status: 'todo',
          priority: 'medium',
          categoryId: 'personal', // Default, could be inferred
          tags: ['ai-generated', activeSuggestion?.type === 'Deep Dive' ? 'voice-plan' : 'quick-add']
      });
      setActiveSuggestion(null);
      setDeepDiveMode('initial');
      setDeepDiveTranscript('');
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              Life Planning
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your long-term goals and life roadmap
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Timeline View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {(['week', 'month', 'year', 'life'] as TimelineView[]).map(view => (
                <button
                  key={view}
                  onClick={() => setTimelineView(view)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                    timelineView === view
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* AI Suggestions */}
            <button
              onClick={() => setShowAiSuggestions(!showAiSuggestions)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI Suggestions
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Goals</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Blocked</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">Filter:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {TASK_CATEGORIES.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* AI Suggestions Panel */}
        {showAiSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  AI-Powered Suggestions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Based on your journal entries from the past month, here are some patterns I noticed:
                </p>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm flex items-start justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <span className="text-purple-600 dark:text-purple-400 font-medium block mb-1">💡 Suggestion:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                        You've mentioned "wanting more time for hobbies" 5 times. Consider adding a task: "Block 2 hours weekly for personal projects"
                        </span>
                    </div>
                    <button 
                        onClick={() => {
                            setActiveSuggestion({ 
                                type: 'Suggestion', 
                                text: 'You\'ve mentioned "wanting more time for hobbies" 5 times.',
                                taskTitle: 'Block 2 hours weekly for personal projects'
                            });
                            setDeepDiveMode('initial');
                        }}
                        className="ml-4 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Create Task
                    </button>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm flex items-start justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <span className="text-purple-600 dark:text-purple-400 font-medium block mb-1">📊 Pattern:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                        Your energy is highest on Tuesday mornings. Schedule important tasks then.
                        </span>
                    </div>
                    <button 
                        onClick={() => {
                             setActiveSuggestion({ 
                                type: 'Pattern', 
                                text: 'Your energy is highest on Tuesday mornings.',
                                taskTitle: 'Schedule deep work session for Tuesday AM'
                            });
                            setDeepDiveMode('initial');
                        }}
                        className="ml-4 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Create Task
                    </button>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm flex items-start justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <span className="text-purple-600 dark:text-purple-400 font-medium block mb-1">⚠️ Alert:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                        3 tasks have been "In Progress" for over 2 weeks. Consider breaking them into smaller steps.
                        </span>
                    </div>
                     <button 
                        onClick={() => {
                             setActiveSuggestion({ 
                                type: 'Alert', 
                                text: '3 tasks have been "In Progress" for over 2 weeks.',
                                taskTitle: 'Break down blocked tasks'
                            });
                            setDeepDiveMode('initial');
                        }}
                        className="ml-4 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Create Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={filteredTasks}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />

      {/* Life Timeline Preview (for "life" view) */}
      {timelineView === 'life' && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Life Timeline (60 Years)
          </h3>
          <div className="relative h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {/* Life phases as colored segments */}
            <div className="absolute inset-y-0 left-0 w-1/6 bg-blue-400 flex items-center justify-center text-xs font-medium text-white">
              2020s
            </div>
            <div className="absolute inset-y-0 left-[16.66%] w-1/6 bg-purple-400 flex items-center justify-center text-xs font-medium text-white">
              2030s
            </div>
            <div className="absolute inset-y-0 left-[33.33%] w-1/6 bg-pink-400 flex items-center justify-center text-xs font-medium text-white">
              2040s
            </div>
            <div className="absolute inset-y-0 left-[50%] w-1/6 bg-orange-400 flex items-center justify-center text-xs font-medium text-white">
              2050s
            </div>
            <div className="absolute inset-y-0 left-[66.66%] w-1/6 bg-yellow-400 flex items-center justify-center text-xs font-medium text-white">
              2060s
            </div>
            <div className="absolute inset-y-0 left-[83.33%] w-1/6 bg-green-400 flex items-center justify-center text-xs font-medium text-white">
              2070s+
            </div>
            {/* Current position marker */}
            <div className="absolute top-0 bottom-0 left-[10%] w-1 bg-red-500 z-10">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                You are here
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Visualize your goals across your entire life journey. Click any decade to see goals for that period.
          </p>
        </div>
      )}
      
      {/* Deep Dive Modal */}
      {activeSuggestion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-500" />
                          Create from Suggestion
                      </h3>
                      <button onClick={() => setActiveSuggestion(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6">
                      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/30">
                          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1 block">Context</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{activeSuggestion.text}"</p>
                      </div>

                      {deepDiveMode === 'initial' && (
                          <div className="space-y-4">
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  How would you like to create this task? You can either quick-add it now, or start a voice "Deep Dive" session to detail exactly what this goal looks like.
                              </p>
                              
                              <div className="grid grid-cols-2 gap-4 mt-6">
                                  <button
                                      onClick={() => createFromSuggestion(activeSuggestion.taskTitle, 'Created from AI suggestion')}
                                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                                  >
                                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800">
                                          <Plus className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-700" />
                                      </div>
                                      <span className="font-medium text-gray-900 dark:text-white">Quick Add</span>
                                      <span className="text-xs text-gray-500 mt-1">Use suggested title</span>
                                  </button>
                                  
                                  <button
                                      onClick={startDeepDiveRecording}
                                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
                                  >
                                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-200 dark:group-hover:bg-red-800">
                                          <Mic className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-red-600" />
                                      </div>
                                      <span className="font-medium text-gray-900 dark:text-white">Deep Dive</span>
                                      <span className="text-xs text-gray-500 mt-1">Record details via voice</span>
                                  </button>
                              </div>
                          </div>
                      )}

                      {deepDiveMode === 'recording' && (
                          <div className="text-center py-8">
                              <div className="inline-block relative mb-4">
                                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-pulse">
                                      <Mic className="w-10 h-10 text-red-600" />
                                  </div>
                              </div>
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Listening...</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                                  Explain what this goal means to you, steps to achieve it, and why it matters.
                              </p>
                              
                              <div className="h-12 mb-6">
                                  <Waveform data={recorder.waveform} isRecording />
                              </div>
                              
                              <button
                                  onClick={stopDeepDiveRecording}
                                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-red-500/30"
                              >
                                  End Session
                              </button>
                          </div>
                      )}

                      {deepDiveMode === 'review' && (
                           <div className="space-y-4">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
                                  <input 
                                      type="text" 
                                      defaultValue={activeSuggestion.taskTitle}
                                      id="deep-dive-title"
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Transcribed)</label>
                                  <textarea 
                                      value={deepDiveTranscript}
                                      onChange={(e) => setDeepDiveTranscript(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-32 resize-none"
                                  />
                              </div>
                              <div className="pt-4 flex gap-3">
                                  <button
                                      onClick={() => setActiveSuggestion(null)}
                                      className="flex-1 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      onClick={() => {
                                          const titleInput = document.getElementById('deep-dive-title') as HTMLInputElement;
                                          createFromSuggestion(titleInput.value, deepDiveTranscript);
                                      }}
                                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg shadow-purple-500/20"
                                  >
                                      Create Task
                                  </button>
                              </div>
                           </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
