import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
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
} from 'lucide-react-native';
import { Card, Button, Badge } from '../../src/components/ui';
import Animated, { FadeInRight } from 'react-native-reanimated';

// ============================================================
// TYPES
// ============================================================

interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  tags: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
  updatedAt: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: KanbanTask['status'];
  color: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const COLUMNS: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', status: 'backlog', color: '#6b7280' },
  { id: 'todo', title: 'To Do', status: 'todo', color: '#3b82f6' },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress', color: '#f59e0b' },
  { id: 'blocked', title: 'Blocked', status: 'blocked', color: '#ef4444' },
  { id: 'done', title: 'Done', status: 'done', color: '#10b981' },
];

const PRIORITY_CONFIG = {
  low: { label: 'Low', variant: 'default' as const },
  medium: { label: 'Medium', variant: 'primary' as const },
  high: { label: 'High', variant: 'warning' as const },
  urgent: { label: 'Urgent', variant: 'danger' as const },
};

// ============================================================
// MOCK DATA (Replace with actual storage later)
// ============================================================

const MOCK_TASKS: KanbanTask[] = [
  {
    id: '1',
    title: 'Complete mobile UI design',
    description: 'Finish the remaining screens for the mobile app',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-01-20',
    tags: ['design', 'mobile'],
    subtasks: [
      { id: 's1', title: 'Timeline screen', completed: true },
      { id: 's2', title: 'Kanban screen', completed: false },
      { id: 's3', title: 'Settings screen', completed: false },
    ],
    createdAt: '2026-01-10',
    updatedAt: '2026-01-12',
  },
  {
    id: '2',
    title: 'Write documentation',
    description: 'Document the API and component usage',
    status: 'todo',
    priority: 'medium',
    tags: ['docs'],
    createdAt: '2026-01-11',
    updatedAt: '2026-01-11',
  },
  {
    id: '3',
    title: 'Fix performance issues',
    status: 'backlog',
    priority: 'low',
    tags: ['bug', 'performance'],
    createdAt: '2026-01-09',
    updatedAt: '2026-01-09',
  },
];

// ============================================================
// COMPONENTS
// ============================================================

interface TaskCardProps {
  task: KanbanTask;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string) => void;
}

function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority];
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const handleLongPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      task.title,
      'Choose an action',
      [
        { text: 'Edit', onPress: () => onEdit(task) },
        { text: 'Move to...', onPress: () => onMove(task.id) },
        { text: 'Delete', onPress: () => onDelete(task.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      delayLongPress={300}
    >
      <Card
        variant="default"
        className={`mb-3 ${isOverdue ? 'border-red-500' : ''}`}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="flex-1 text-white font-medium text-sm mr-2">
            {task.title}
          </Text>
          <TouchableOpacity
            onPress={handleLongPress}
            className="p-1 rounded-lg active:bg-slate-700"
          >
            <MoreVertical size={16} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        {task.description && (
          <Text
            className="text-dark-text-secondary text-xs mb-3"
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        {/* Subtasks Progress */}
        {totalSubtasks > 0 && (
          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <CheckCircle2 size={12} color="#64748b" />
              <Text className="text-dark-text-secondary text-xs ml-1">
                {completedSubtasks}/{totalSubtasks} subtasks
              </Text>
            </View>
            <View className="h-1.5 bg-dark-border rounded-full overflow-hidden">
              <View
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                }}
              />
            </View>
          </View>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="purple" size="sm">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{task.tags.length - 3}
              </Badge>
            )}
          </View>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-between">
          <Badge variant={priority.variant} size="sm">
            {priority.label}
          </Badge>

          {task.dueDate && (
            <View className="flex-row items-center">
              <Calendar
                size={12}
                color={isOverdue ? '#ef4444' : '#64748b'}
              />
              <Text
                className={`text-xs ml-1 ${
                  isOverdue ? 'text-red-400' : 'text-dark-text-secondary'
                }`}
              >
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ============================================================
// TASK MODAL
// ============================================================

interface TaskModalProps {
  visible: boolean;
  task?: KanbanTask;
  defaultStatus?: KanbanTask['status'];
  onClose: () => void;
  onSave: (task: Partial<KanbanTask>) => void;
}

function TaskModal({ visible, task, defaultStatus = 'todo', onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<KanbanTask['status']>(task?.status || defaultStatus);
  const [priority, setPriority] = useState<KanbanTask['priority']>(task?.priority || 'medium');
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-dark-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#f8fafc" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">
            {task ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-primary-500 text-base font-medium">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Title */}
          <View className="mb-4">
            <Text className="text-dark-text-primary text-sm font-medium mb-2">
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor="#64748b"
              className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white"
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-dark-text-primary text-sm font-medium mb-2">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white"
            />
          </View>

          {/* Status */}
          <View className="mb-4">
            <Text className="text-dark-text-primary text-sm font-medium mb-2">
              Status
            </Text>
            <TouchableOpacity
              onPress={() => setShowStatusPicker(!showStatusPicker)}
              className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 flex-row items-center justify-between"
            >
              <Text className="text-white">
                {COLUMNS.find((c) => c.status === status)?.title}
              </Text>
              <ChevronDown size={20} color="#94a3b8" />
            </TouchableOpacity>
            {showStatusPicker && (
              <View className="mt-2 bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
                {COLUMNS.map((col) => (
                  <TouchableOpacity
                    key={col.id}
                    onPress={() => {
                      setStatus(col.status);
                      setShowStatusPicker(false);
                    }}
                    className={`px-4 py-3 border-b border-dark-border ${
                      status === col.status ? 'bg-primary-600/20' : ''
                    }`}
                  >
                    <Text className="text-white">{col.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Priority */}
          <View className="mb-4">
            <Text className="text-dark-text-primary text-sm font-medium mb-2">
              Priority
            </Text>
            <TouchableOpacity
              onPress={() => setShowPriorityPicker(!showPriorityPicker)}
              className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 flex-row items-center justify-between"
            >
              <Text className="text-white">
                {PRIORITY_CONFIG[priority].label}
              </Text>
              <ChevronDown size={20} color="#94a3b8" />
            </TouchableOpacity>
            {showPriorityPicker && (
              <View className="mt-2 bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
                {Object.entries(PRIORITY_CONFIG).map(([key, { label }]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      setPriority(key as KanbanTask['priority']);
                      setShowPriorityPicker(false);
                    }}
                    className={`px-4 py-3 border-b border-dark-border ${
                      priority === key ? 'bg-primary-600/20' : ''
                    }`}
                  >
                    <Text className="text-white">{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function KanbanScreen() {
  const [tasks, setTasks] = useState<KanbanTask[]>(MOCK_TASKS);
  const [selectedColumn, setSelectedColumn] = useState<KanbanColumn>(COLUMNS[1]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | undefined>();

  const columnTasks = useMemo(
    () => tasks.filter((t) => t.status === selectedColumn.status),
    [tasks, selectedColumn]
  );

  const handleAddTask = () => {
    setEditingTask(undefined);
    setModalVisible(true);
  };

  const handleEditTask = useCallback((task: KanbanTask) => {
    setEditingTask(task);
    setModalVisible(true);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTasks((prev) => prev.filter((t) => t.id !== taskId)),
        },
      ]
    );
  }, []);

  const handleMoveTask = useCallback((taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const options = COLUMNS.filter((c) => c.status !== task.status).map((col) => ({
      text: `Move to ${col.title}`,
      onPress: () => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: col.status } : t
          )
        );
      },
    }));

    Alert.alert('Move Task', 'Choose a column', [
      ...options,
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [tasks]);

  const handleSaveTask = useCallback((taskData: Partial<KanbanTask>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
            : t
        )
      );
    } else {
      const newTask: KanbanTask = {
        id: Date.now().toString(),
        title: taskData.title!,
        description: taskData.description,
        status: taskData.status || selectedColumn.status,
        priority: taskData.priority || 'medium',
        tags: taskData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
    }
  }, [editingTask, selectedColumn]);

  const renderTask = useCallback(
    ({ item, index }: { item: KanbanTask; index: number }) => (
      <Animated.View entering={FadeInRight.delay(index * 50)}>
        <TaskCard
          task={item}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onMove={handleMoveTask}
        />
      </Animated.View>
    ),
    [handleEditTask, handleDeleteTask, handleMoveTask]
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['bottom']}>
      {/* Column Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 pt-4 max-h-16"
      >
        <View className="flex-row space-x-2 pb-3">
          {COLUMNS.map((column) => {
            const columnTaskCount = tasks.filter(
              (t) => t.status === column.status
            ).length;
            const isSelected = selectedColumn.id === column.id;

            return (
              <TouchableOpacity
                key={column.id}
                onPress={() => setSelectedColumn(column)}
                className={`px-4 py-2 rounded-lg flex-row items-center space-x-2 ${
                  isSelected ? 'bg-primary-600' : 'bg-dark-surface border border-dark-border'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-dark-text-secondary'
                  }`}
                >
                  {column.title}
                </Text>
                <View
                  className={`px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-dark-border'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-dark-text-secondary'
                    }`}
                  >
                    {columnTaskCount}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Tasks List */}
      <View className="flex-1 px-4 pt-2">
        {columnTasks.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-dark-text-secondary text-base mb-4">
              No tasks in {selectedColumn.title}
            </Text>
            <Button onPress={handleAddTask} variant="primary">
              Add First Task
            </Button>
          </View>
        ) : (
          <FlashList
            data={columnTasks}
            renderItem={renderTask}
            estimatedItemSize={120}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={handleAddTask}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-600 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>

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
