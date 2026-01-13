/**
 * Task Detail Screen - View and edit task with subtasks
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeHaptics as Haptics } from '../../src/lib/haptics';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  ChevronLeft, 
  Edit3, 
  Trash2, 
  Calendar,
  Clock,
  Flag,
  Check,
  Square,
  Plus,
  X,
  MoreVertical,
  CheckCircle2,
  Circle,
} from 'lucide-react-native';
import { Card } from '../../src/components/ui';
import * as storage from '../../src/lib/storage';

// ============================================================
// TYPES
// ============================================================

type TaskStatus = 'todo' | 'in-progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  subtasks?: Subtask[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const STATUS_CONFIG = {
  'todo': { label: 'To Do', color: '#3b82f6', bg: 'bg-blue-500/20' },
  'in-progress': { label: 'In Progress', color: '#f59e0b', bg: 'bg-amber-500/20' },
  'done': { label: 'Done', color: '#10b981', bg: 'bg-emerald-500/20' },
};

const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: '#64748b' },
  'medium': { label: 'Medium', color: '#f59e0b' },
  'high': { label: 'High', color: '#ef4444' },
};

// ============================================================
// HELPERS
// ============================================================

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

// ============================================================
// SUBTASK ITEM
// ============================================================

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
}

function SubtaskItem({ subtask, onToggle, onDelete }: SubtaskItemProps) {
  return (
    <View className="flex-row items-center py-3 border-b border-white/5">
      <TouchableOpacity onPress={onToggle} className="mr-3">
        {subtask.completed ? (
          <CheckCircle2 size={22} color="#10b981" />
        ) : (
          <Circle size={22} color="#64748b" />
        )}
      </TouchableOpacity>
      
      <Text 
        className={`flex-1 text-base ${subtask.completed ? 'text-slate-500 line-through' : 'text-white'}`}
        style={{ fontFamily: 'Inter_400Regular' }}
      >
        {subtask.text}
      </Text>
      
      <TouchableOpacity onPress={onDelete} className="p-1">
        <X size={16} color="#64748b" />
      </TouchableOpacity>
    </View>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadTask = () => {
    const tasks = storage.getTasks();
    const found = tasks.find((t: any) => t.id === id);
    if (found) {
      setTask(found as Task);
      setEditedTitle(found.title || '');
      setEditedDescription(found.description || '');
    }
  };

  const handleDelete = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (id) {
              storage.deleteTask(id);
              router.back();
            }
          }
        },
      ]
    );
  }, [id, router]);

  const handleSave = useCallback(async () => {
    if (!task) return;
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    const updated = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      updatedAt: new Date().toISOString(),
    };
    
    storage.saveTask(updated);
    setTask(updated);
    setIsEditing(false);
  }, [task, editedTitle, editedDescription]);

  const handleStatusChange = useCallback((newStatus: TaskStatus) => {
    if (!task) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const updated = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    storage.saveTask(updated);
    setTask(updated);
  }, [task]);

  const handlePriorityChange = useCallback((newPriority: TaskPriority) => {
    if (!task) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const updated = {
      ...task,
      priority: newPriority,
      updatedAt: new Date().toISOString(),
    };
    storage.saveTask(updated);
    setTask(updated);
  }, [task]);

  const handleAddSubtask = useCallback(() => {
    if (!task || !newSubtask.trim()) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const subtask: Subtask = {
      id: `sub-${Date.now()}`,
      text: newSubtask.trim(),
      completed: false,
    };
    
    const updated = {
      ...task,
      subtasks: [...(task.subtasks || []), subtask],
      updatedAt: new Date().toISOString(),
    };
    storage.saveTask(updated);
    setTask(updated);
    setNewSubtask('');
  }, [task, newSubtask]);

  const handleToggleSubtask = useCallback((subtaskId: string) => {
    if (!task) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const updated = {
      ...task,
      subtasks: task.subtasks?.map(s => 
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      ),
      updatedAt: new Date().toISOString(),
    };
    storage.saveTask(updated);
    setTask(updated);
  }, [task]);

  const handleDeleteSubtask = useCallback((subtaskId: string) => {
    if (!task) return;
    
    const updated = {
      ...task,
      subtasks: task.subtasks?.filter(s => s.id !== subtaskId),
      updatedAt: new Date().toISOString(),
    };
    storage.saveTask(updated);
    setTask(updated);
  }, [task]);

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center">
        <Text className="text-slate-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const subtaskProgress = task.subtasks?.length 
    ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)
    : 0;

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Task Details',
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ChevronLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {isEditing ? (
                <>
                  <TouchableOpacity onPress={() => setIsEditing(false)}>
                    <X size={20} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave}>
                    <Check size={20} color="#10b981" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Edit3 size={20} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete}>
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }}
      />
      
      <SafeAreaView className="flex-1 bg-slate-950" edges={['bottom']}>
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title & Description */}
          <Animated.View entering={FadeInDown.delay(100).springify().damping(15)}>
            <Card variant="glass" className="border-white/5 mb-6">
              {isEditing ? (
                <View className="gap-4">
                  <TextInput
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                    placeholder="Task title"
                    placeholderTextColor="#64748b"
                    className="text-white text-xl font-semibold"
                    style={{ fontFamily: 'Inter_700Bold' }}
                  />
                  <TextInput
                    value={editedDescription}
                    onChangeText={setEditedDescription}
                    placeholder="Add description..."
                    placeholderTextColor="#64748b"
                    multiline
                    className="text-slate-300 text-base"
                    style={{ fontFamily: 'Inter_400Regular', minHeight: 100, textAlignVertical: 'top' }}
                  />
                </View>
              ) : (
                <>
                  <Text className="text-white text-xl font-semibold mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
                    {task.title}
                  </Text>
                  {task.description && (
                    <Text className="text-slate-400 text-base leading-6" style={{ fontFamily: 'Inter_400Regular' }}>
                      {task.description}
                    </Text>
                  )}
                </>
              )}
            </Card>
          </Animated.View>

          {/* Status & Priority */}
          <Animated.View entering={FadeInDown.delay(150).springify().damping(15)} className="mb-6">
            <View className="flex-row gap-3">
              {/* Status */}
              <Card variant="glass" className="flex-1 border-white/5">
                <Text className="text-slate-400 text-xs mb-3" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  STATUS
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map(status => {
                    const config = STATUS_CONFIG[status];
                    const isActive = task.status === status;
                    return (
                      <TouchableOpacity
                        key={status}
                        onPress={() => handleStatusChange(status)}
                        className={`px-3 py-1.5 rounded-full border ${
                          isActive ? 'border-white/20' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: isActive ? `${config.color}30` : `${config.color}10` }}
                      >
                        <Text 
                          className="text-xs"
                          style={{ fontFamily: 'Inter_600SemiBold', color: config.color }}
                        >
                          {config.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Card>

              {/* Priority */}
              <Card variant="glass" className="flex-1 border-white/5">
                <Text className="text-slate-400 text-xs mb-3" style={{ fontFamily: 'Inter_600SemiBold' }}>
                  PRIORITY
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map(priority => {
                    const config = PRIORITY_CONFIG[priority];
                    const isActive = task.priority === priority;
                    return (
                      <TouchableOpacity
                        key={priority}
                        onPress={() => handlePriorityChange(priority)}
                        className={`flex-row items-center px-3 py-1.5 rounded-full border ${
                          isActive ? 'border-white/20' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: isActive ? `${config.color}30` : `${config.color}10` }}
                      >
                        <Flag size={12} color={config.color} />
                        <Text 
                          className="text-xs ml-1"
                          style={{ fontFamily: 'Inter_600SemiBold', color: config.color }}
                        >
                          {config.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Card>
            </View>
          </Animated.View>

          {/* Due Date Display */}
          <Animated.View entering={FadeInDown.delay(200).springify().damping(15)} className="mb-6">
            <Card variant="glass" className={`border-white/5 ${isOverdue(task.dueDate) && task.status !== 'done' ? 'border-red-500/30' : ''}`}>
              <View className="flex-row items-center">
                <Calendar size={20} color={isOverdue(task.dueDate) && task.status !== 'done' ? '#ef4444' : '#64748b'} />
                <View className="ml-3 flex-1">
                  <Text className="text-slate-400 text-xs" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    DUE DATE
                  </Text>
                  <Text 
                    className={`text-base mt-0.5 ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-white'}`}
                    style={{ fontFamily: 'Inter_600SemiBold' }}
                  >
                    {formatDate(task.dueDate)}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Subtasks */}
          <Animated.View entering={FadeInDown.delay(250).springify().damping(15)}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_600SemiBold' }}>
                SUBTASKS
              </Text>
              {task.subtasks && task.subtasks.length > 0 && (
                <Text className="text-slate-500 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
                  {subtaskProgress}% complete
                </Text>
              )}
            </View>
            
            <Card variant="glass" className="border-white/5">
              {/* Subtask List */}
              {task.subtasks?.map((subtask, index) => (
                <Animated.View key={subtask.id} entering={FadeInRight.delay(index * 50)}>
                  <SubtaskItem
                    subtask={subtask}
                    onToggle={() => handleToggleSubtask(subtask.id)}
                    onDelete={() => handleDeleteSubtask(subtask.id)}
                  />
                </Animated.View>
              ))}

              {/* Add Subtask */}
              <View className="flex-row items-center pt-3 gap-2">
                <TextInput
                  value={newSubtask}
                  onChangeText={setNewSubtask}
                  placeholder="Add a subtask..."
                  placeholderTextColor="#64748b"
                  className="flex-1 text-white text-base py-2"
                  style={{ fontFamily: 'Inter_400Regular' }}
                  onSubmitEditing={handleAddSubtask}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={handleAddSubtask}
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    newSubtask.trim() ? 'bg-primary-500' : 'bg-slate-800'
                  }`}
                  disabled={!newSubtask.trim()}
                >
                  <Plus size={18} color={newSubtask.trim() ? '#ffffff' : '#64748b'} />
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
