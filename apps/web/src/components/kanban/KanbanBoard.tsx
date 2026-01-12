/**
 * KanbanBoard - Drag-and-drop life planning board
 * For managing tasks and goals across life categories
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// TYPES
// ============================================================

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  tags: string[];
  categoryId?: string;
  linkedJournalIds?: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: KanbanTask['status'];
  color: string;
}

// ============================================================
// DEFAULT COLUMNS
// ============================================================

const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', status: 'backlog', color: 'gray' },
  { id: 'todo', title: 'To Do', status: 'todo', color: 'blue' },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress', color: 'yellow' },
  { id: 'blocked', title: 'Blocked', status: 'blocked', color: 'red' },
  { id: 'done', title: 'Done', status: 'done', color: 'green' },
];

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
  medium: { label: 'Medium', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  high: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  urgent: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
};

// ============================================================
// TASK CARD COMPONENT
// ============================================================

interface TaskCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, newStatus: KanbanTask['status']) => void;
}

function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700",
        "hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
        isOverdue && "border-red-300 dark:border-red-700"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
            {task.title}
          </h4>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <button
                  onClick={() => { onEdit(task); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                {DEFAULT_COLUMNS.filter(c => c.status !== task.status).map(col => (
                  <button
                    key={col.id}
                    onClick={() => { onMove(task.id, col.status); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Move to {col.title}
                  </button>
                ))}
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <button
                  onClick={() => { onDelete(task.id); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full text-xs">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Priority */}
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", priority.bg, priority.color)}>
            {priority.label}
          </span>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
          )}>
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// COLUMN COMPONENT
// ============================================================

interface ColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onAddTask: (status: KanbanTask['status']) => void;
  onEditTask: (task: KanbanTask) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: KanbanTask['status']) => void;
}

function Column({ column, tasks, onAddTask, onEditTask, onDeleteTask, onMoveTask }: ColumnProps) {
  const colorClasses = {
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  };

  return (
    <div className="flex-shrink-0 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold", colorClasses[column.color as keyof typeof colorClasses])}>
            {column.title}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.status)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-3 min-h-[200px]">
        <AnimatePresence mode="popLayout">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ADD/EDIT TASK MODAL
// ============================================================

interface TaskModalProps {
  task?: KanbanTask | null;
  isOpen: boolean;
  defaultStatus?: KanbanTask['status'];
  onClose: () => void;
  onSave: (task: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function TaskModal({ task, isOpen, defaultStatus = 'todo', onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<KanbanTask['status']>(task?.status || defaultStatus);
  const [priority, setPriority] = useState<KanbanTask['priority']>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [tagsInput, setTagsInput] = useState(task?.tags.join(', ') || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as KanbanTask['status'])}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {DEFAULT_COLUMNS.map(col => (
                  <option key={col.id} value={col.status}>{col.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as KanbanTask['priority'])}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="health, career, family"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================================
// MAIN KANBAN BOARD
// ============================================================

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onTaskCreate: (task: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

export default function KanbanBoard({ tasks, onTaskCreate, onTaskUpdate, onTaskDelete }: KanbanBoardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<KanbanTask['status']>('todo');

  const handleAddTask = (status: KanbanTask['status']) => {
    setDefaultStatus(status);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task: KanbanTask) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleMoveTask = (taskId: string, newStatus: KanbanTask['status']) => {
    onTaskUpdate(taskId, { status: newStatus, updatedAt: new Date().toISOString() });
  };

  const handleSaveTask = (taskData: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      onTaskUpdate(editingTask.id, { ...taskData, updatedAt: new Date().toISOString() });
    } else {
      onTaskCreate(taskData);
    }
  };

  const getTasksForColumn = (status: KanbanTask['status']) => 
    tasks.filter(t => t.status === status);

  return (
    <div className="h-full">
      {/* Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        {DEFAULT_COLUMNS.map(column => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksForColumn(column.status)}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={onTaskDelete}
            onMoveTask={handleMoveTask}
          />
        ))}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={modalOpen}
        defaultStatus={defaultStatus}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}
