import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import {
  Plus,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  ChevronDown,
  Clock,
  Tag as TagIcon,
} from 'lucide-react-native';
import { Card, Button, Badge } from '../../src/components/ui';
import * as storage from '../../src/lib/storage';
import { StoredTask } from '../../src/lib/storage';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

// ============================================================
// TYPES & CONSTANTS
// ============================================================

type KanbanStatus = StoredTask['status'];
type KanbanPriority = StoredTask['priority'];

interface KanbanColumn {
  id: string;
  title: string;
  status: KanbanStatus;
  color: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', status: 'todo', color: '#3b82f6' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: '#f59e0b' },
  { id: 'done', title: 'Done', status: 'done', color: '#10b981' },
  { id: 'backlog', title: 'Backlog', status: 'backlog', color: '#64748b' },
];

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#94a3b8', bg: 'bg-slate-500/10' },
  medium: { label: 'Medium', color: '#3b82f6', bg: 'bg-blue-500/10' },
  high: { label: 'High', color: '#f59e0b', bg: 'bg-amber-500/10' },
};

// ============================================================
// COMPONENTS
// ============================================================

interface TaskCardProps {
  task: StoredTask;
  onEdit: (task: StoredTask) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string) => void;
}

function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const handlePress = () => onEdit(task);

  const handleLongPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Task Actions',
      task.title,
      [
        { text: 'Move Status', onPress: () => onMove(task.id) },
        { text: 'Delete Task', onPress: () => onDelete(task.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <Animated.View 
      layout={Layout.springify()}
      entering={FadeInDown.springify().damping(15)}
    >
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.9}
        className="mb-4"
      >
        <Card variant="glass" className="border-white/5">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2">
              <Text 
                className="text-white text-base font-semibold"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                {task.title}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-md ${priority.bg}`}>
              <Text 
                className="text-[10px] font-bold uppercase"
                style={{ color: priority.color, fontFamily: 'Inter_700Bold' }}
              >
                {priority.label}
              </Text>
            </View>
          </View>

          {task.description && (
            <Text 
              className="text-slate-400 text-xs mb-3 leading-4"
              numberOfLines={2}
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              {task.description}
            </Text>
          )}

          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center space-x-3">
              {task.dueDate && (
                <View className="flex-row items-center opacity-70">
                  <Calendar size={12} color={isOverdue ? '#ef4444' : '#94a3b8'} />
                  <Text 
                    className={`text-[11px] ml-1 ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}
                    style={{ fontFamily: 'Inter_400Regular' }}
                  >
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              )}
              {task.category && (
                <View className="flex-row items-center opacity-70">
                  <TagIcon size={12} color="#94a3b8" />
                  <Text 
                    className="text-[11px] ml-1 text-slate-400"
                    style={{ fontFamily: 'Inter_400Regular' }}
                  >
                    {task.category}
                  </Text>
                </View>
              )}
            </View>
            
            <View className="flex-row items-center opacity-50">
              <Clock size={10} color="#94a3b8" />
              <Text className="text-[10px] text-slate-400 ml-1">
                {new Date(task.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================================
// TASK MODAL
// ============================================================

interface TaskModalProps {
  visible: boolean;
  task?: StoredTask;
  defaultStatus?: KanbanStatus;
  onClose: () => void;
  onSave: (task: Partial<StoredTask>) => void;
}

function TaskModal({ visible, task, defaultStatus = 'todo', onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<KanbanStatus>(defaultStatus);
  const [priority, setPriority] = useState<KanbanPriority>('medium');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setStatus(task?.status || defaultStatus);
      setPriority(task?.priority || 'medium');
      setCategory(task?.category || '');
    }
  }, [visible, task, defaultStatus]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title to continue.');
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category: category.trim(),
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-950">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/5">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-slate-400 text-base" style={{ fontFamily: 'Inter_400Regular' }}>Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
            {task ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-primary-500 text-base font-bold" style={{ fontFamily: 'Inter_700Bold' }}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-8">
          <View className="mb-6">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
              Task Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor="#475569"
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base"
              style={{ fontFamily: 'Inter_400Regular' }}
            />
          </View>

          <View className="mb-6">
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add some context or details..."
              placeholderTextColor="#475569"
              multiline
              numberOfLines={4}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base min-h-[120px]"
              style={{ fontFamily: 'Inter_400Regular' }}
              textAlignVertical="top"
            />
          </View>

          <View className="flex-row space-x-4 mb-6">
            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                Priority
              </Text>
              <View className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {(['low', 'medium', 'high'] as KanbanPriority[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p)}
                    className={`px-4 py-3 items-center border-b border-white/5 ${priority === p ? 'bg-primary-500/20' : ''}`}
                  >
                    <Text className={`capitalize ${priority === p ? 'text-primary-400 font-bold' : 'text-slate-400'}`}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                Category
              </Text>
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="Work, Life..."
                placeholderTextColor="#475569"
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base"
                style={{ fontFamily: 'Inter_400Regular' }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<StoredTask[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<KanbanColumn>(COLUMNS[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<StoredTask | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(() => {
    const allTasks = storage.getTasks();
    setTasks(allTasks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.status === selectedColumn.status),
    [tasks, selectedColumn]
  );

  const handleAddTask = () => {
    setEditingTask(undefined);
    setModalVisible(true);
  };

  const handleEditTask = (task: StoredTask) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSaveTask = (taskData: Partial<StoredTask>) => {
    if (editingTask) {
      storage.updateTask(editingTask.id, taskData);
    } else {
      storage.saveTask({
        title: taskData.title!,
        description: taskData.description,
        status: taskData.status || selectedColumn.status,
        priority: taskData.priority || 'medium',
        category: taskData.category,
      });
    }
    loadTasks();
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'No' },
      { text: 'Yes, Delete', style: 'destructive', onPress: () => {
        storage.deleteTask(taskId);
        loadTasks();
      }}
    ]);
  };

  const handleMoveTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const options = COLUMNS.map(col => ({
      text: col.title,
      onPress: () => {
        storage.updateTask(taskId, { status: col.status });
        loadTasks();
      }
    }));

    Alert.alert('Move to Status', 'Change the current progress state:', [
      ...options,
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const renderTask = useCallback(({ item }: { item: StoredTask }) => (
    <TaskCard 
      task={item} 
      onEdit={handleEditTask} 
      onDelete={handleDeleteTask} 
      onMove={handleMoveTask} 
    />
  ), [handleEditTask, handleDeleteTask, handleMoveTask]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
            Board
          </Text>
          <Text className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            {tasks.length} active initiatives
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleAddTask}
          className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center shadow-lg shadow-primary-500/40"
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Column Selector */}
      <View className="px-6 mb-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {COLUMNS.map((col) => {
            const count = tasks.filter(t => t.status === col.status).length;
            const active = selectedColumn.id === col.id;
            return (
              <TouchableOpacity
                key={col.id}
                onPress={() => setSelectedColumn(col)}
                className={`mr-3 px-4 py-2.5 rounded-2xl flex-row items-center space-x-2 border ${
                  active ? 'bg-primary-500/20 border-primary-500' : 'bg-white/5 border-white/5'
                }`}
              >
                <Text 
                  className={`text-sm font-semibold ${active ? 'text-primary-400' : 'text-slate-400'}`}
                  style={{ fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular' }}
                >
                  {col.title}
                </Text>
                <View className={`px-1.5 py-0.5 rounded-md ${active ? 'bg-primary-500' : 'bg-slate-800'}`}>
                  <Text className="text-[10px] text-white font-bold">{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Task List */}
      <View className="flex-1 px-6">
        {filteredTasks.length === 0 ? (
          <View className="flex-1 items-center justify-center opacity-30">
            <CheckCircle2 size={64} color="#94a3b8" />
            <Text className="text-white text-lg font-bold mt-4" style={{ fontFamily: 'Inter_700Bold' }}>
              All caught up!
            </Text>
            <Text className="text-slate-400 text-sm mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
              No tasks currently in {selectedColumn.title}
            </Text>
          </View>
        ) : (
          <FlashList
            data={filteredTasks}
            renderItem={renderTask}
            estimatedItemSize={140}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      {/* Task Modal */}
      <TaskModal
        visible={modalVisible}
        task={editingTask}
        defaultStatus={selectedColumn.status}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
      />
    </SafeAreaView>
  );
}

