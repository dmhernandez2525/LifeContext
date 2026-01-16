import { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Haptics from 'expo-haptics';
import { Target, Plus, Brain, Sparkles, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { LifeTimeline, Decade } from '../src/components/life-planning/LifeTimeline';
import { GoalCard } from '../src/components/life-planning/GoalCard';
import * as storage from '../src/lib/storage';
import { StoredTask } from '../src/lib/storage';
import { DeepDiveSheet } from '../src/components/life-planning/DeepDiveSheet';


export default function LifePlanningScreen() {
  const [selectedDecade, setSelectedDecade] = useState<Decade>('2020s');
  const [goals, setGoals] = useState<StoredTask[]>([]);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  
  // Deep Dive
  // const { present: presentDeepDive, dismiss: dismissDeepDive } = useBottomSheetModal();
  const [deepDiveContext, setDeepDiveContext] = useState('');

  const openDeepDive = (context = '') => {
    setDeepDiveContext(context);
    // Unique name/index logic will be handled by the sheet rendering in Root or here
    // But since it's a BottomSheetModal, we usually present it. 
    // Wait, DeepDiveSheet is wrapper around BaseBottomSheet which is a BottomSheetModal.
    // So we just need to conditionally render it or manage its visible prop index.
    // BaseBottomSheet takes 'index' prop (0 to show, -1 to hide).
    // Let's use simple state for now.
    setDeepDiveVisible(true); 
  };
  const [deepDiveVisible, setDeepDiveVisible] = useState(false);

  const loadGoals = useCallback(() => {
    // We filter tasks that are tagged as "Life Goal" or related categories
    const allTasks = storage.getTasks();
    const lifeGoals = allTasks.filter(t => 
      t.category === 'Life Goal' || 
      t.category === 'Vision' || 
      t.category === 'Career' || // Demo mapping
      t.priority === 'high'      // Assuming high priority tasks might be goals for now
    );
    setGoals(lifeGoals);
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Filter goals by selected decade
  // TODO: Add targetDecade field to StoredTask type for proper decade-based filtering
  // Currently showing all goals regardless of selected decade
  const filteredGoals = useMemo(() => {
    return goals; 
  }, [goals, selectedDecade]);

  const stats = useMemo(() => ({
    total: goals.length,
    achieved: goals.filter(g => g.status === 'done').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
  }), [goals]);

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Required', 'Please enter a goal title');
      return;
    }

    storage.saveTask({
      title: newGoalTitle,
      description: newGoalDescription,
      status: 'todo',
      priority: 'high',
      category: 'Life Goal',
      dueDate: new Date().toISOString() // TODO: Add better date picker later
    });

    setNewGoalTitle('');
    setNewGoalDescription('');
    setModalVisible(false);
    loadGoals();
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDeleteGoal = (id: string) => {
    Alert.alert('Delete Goal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          storage.deleteTask(id);
          loadGoals();
        }
      }
    ]);
  };

  const handleUpdateGoal = (goal: StoredTask) => {
    // Toggle status for demo purposes on tap
    const newStatus = goal.status === 'done' ? 'todo' : 'done';
    storage.updateTask(goal.id, { status: newStatus });
    loadGoals();
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-6 py-6 flex-row justify-between items-center">
            <View>
                <Text className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
                Life Plan
                </Text>
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                Design your future, strictly on your terms.
                </Text>
            </View>
            <View className="w-12 h-12 bg-purple-500/20 rounded-full items-center justify-center">
                <Target color="#a855f7" size={24} />
            </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 flex-row gap-3 mb-8">
            <View className="flex-1 bg-slate-900 rounded-2xl p-4 border border-slate-800">
                <Text className="text-2xl font-bold text-white mb-1">{stats.total}</Text>
                <Text className="text-xs text-slate-500 font-bold uppercase">Total Goals</Text>
            </View>
            <View className="flex-1 bg-green-950/30 rounded-2xl p-4 border border-green-900/30">
                <Text className="text-2xl font-bold text-green-400 mb-1">{stats.achieved}</Text>
                <Text className="text-xs text-green-600 font-bold uppercase">Achieved</Text>
            </View>
            <View className="flex-1 bg-purple-950/30 rounded-2xl p-4 border border-purple-900/30">
                <Text className="text-2xl font-bold text-purple-400 mb-1">{stats.inProgress}</Text>
                <Text className="text-xs text-purple-600 font-bold uppercase">Active</Text>
            </View>
        </View>

        {/* Timeline Visualization */}
        <LifeTimeline 
            selectedDecade={selectedDecade} 
            onSelectDecade={setSelectedDecade}
        />

        {/* AI Suggestions Teaser */}
        <View className="px-6 mb-6">
            <LinearGradient
                colors={['#2e1065', '#4c1d95']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl p-5 relative overflow-hidden"
            >
                <TouchableOpacity onPress={() => openDeepDive('Traveling to Japan')}>
                <View className="flex-row items-center space-x-3 mb-3 relative z-10">
                    <Sparkles size={20} color="#e9d5ff" />
                    <Text className="text-white font-bold text-base">AI Insight</Text>
                </View>
                <Text className="text-purple-100 text-sm leading-5 relative z-10">
                    "You've mentioned 'traveling to Japan' in 3 journal entries this month. Should we add this to your 2020s goals?"
                </Text>
                </TouchableOpacity>
                
                {/* Decorative Elements */}
                <View className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </LinearGradient>
        </View>

        {/* Goals List */}
        <View className="px-6 mb-4 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
                Goals for {selectedDecade}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Plus size={24} color="#a855f7" />
            </TouchableOpacity>
        </View>

        <View className="px-6">
            {filteredGoals.length > 0 ? (
                filteredGoals.map((goal, index) => (
                    <GoalCard 
                        key={goal.id} 
                        goal={goal} 
                        index={index}
                        onPress={handleUpdateGoal}
                        onDelete={handleDeleteGoal}
                    />
                ))
            ) : (
                <View className="items-center py-10 opacity-50">
                    <Brain size={48} color="#64748b" />
                    <Text className="text-slate-500 mt-4 text-center">
                        No goals set for this decade yet.{'\n'}Dream big and start now.
                    </Text>
                </View>
            )}
        </View>
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/80">
            <View className="bg-slate-900 rounded-t-3xl p-6 border-t border-slate-800">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-bold text-white">New Life Goal</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <X size={24} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <Text className="text-slate-400 text-xs font-bold uppercase mb-2">Goal Title</Text>
                <TextInput
                    value={newGoalTitle}
                    onChangeText={setNewGoalTitle}
                    placeholder="e.g., Retire by 45"
                    placeholderTextColor="#475569"
                    className="bg-slate-800 rounded-xl p-4 text-white text-base mb-4 border border-slate-700"
                    autoFocus
                />

                <Text className="text-slate-400 text-xs font-bold uppercase mb-2">Description</Text>
                <TextInput
                    value={newGoalDescription}
                    onChangeText={setNewGoalDescription}
                    placeholder="Why does this matter?"
                    placeholderTextColor="#475569"
                    multiline
                    className="bg-slate-800 rounded-xl p-4 text-white text-base mb-6 border border-slate-700 min-h-[100px]"
                    textAlignVertical="top"
                />

                <TouchableOpacity 
                    onPress={handleAddGoal}
                    className="bg-purple-600 rounded-xl py-4 items-center mb-6"
                >
                    <Text className="text-white font-bold text-base">Create Goal</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {deepDiveVisible && (
        <DeepDiveSheet 
            index={0} 
            initialContext={deepDiveContext}
            onClose={() => {
                setDeepDiveVisible(false);
                loadGoals(); // Refresh in case task was added
            }} 
        />
      )}
    </SafeAreaView>
  );
}
