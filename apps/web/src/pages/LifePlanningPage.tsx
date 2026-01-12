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
  Sparkles
} from 'lucide-react';
import KanbanBoard, { KanbanTask } from '@/components/kanban/KanbanBoard';
import { DEMO_TASKS, TASK_CATEGORIES, Task } from '@/data/demo-tasks';

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
  }));
};

type TimelineView = 'week' | 'month' | 'year' | 'life';

export default function LifePlanningPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [timelineView, setTimelineView] = useState<TimelineView>('year');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

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

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(t => t.categoryId === selectedCategory);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  return (
    <div className="min-h-screen">
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
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">💡 Suggestion:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      You've mentioned "wanting more time for hobbies" 5 times. Consider adding a task: "Block 2 hours weekly for personal projects"
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">📊 Pattern:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      Your energy is highest on Tuesday mornings. Schedule important tasks then.
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">⚠️ Alert:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      3 tasks have been "In Progress" for over 2 weeks. Consider breaking them into smaller steps.
                    </span>
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
    </div>
  );
}
