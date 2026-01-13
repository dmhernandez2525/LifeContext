/**
 * Dashboard Screen (Home) - Main hub for LifeContext mobile app
 * 
 * Rocket Money-inspired dashboard with:
 * - Overall progress indicator
 * - Stats cards (recording time, questions answered, active tasks)
 * - Quick action cards
 * - Recent activity list
 * - Suggested questions carousel
 */
import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeHaptics as Haptics } from '../../src/lib/haptics';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { 
  Mic, 
  BookOpen, 
  Brain, 
  Sparkles, 
  Clock,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  Play,
} from 'lucide-react-native';
import * as storage from '../../src/lib/storage';
import { Card } from '../../src/components/ui';

// ============================================================
// TYPES
// ============================================================

interface DashboardStats {
  totalRecordingTime: number; // in seconds
  recordingCount: number;
  journalCount: number;
  brainDumpCount: number;
  taskCount: number;
  tasksCompleted: number;
}

interface RecentItem {
  id: string;
  type: 'recording' | 'journal' | 'brain-dump';
  title: string;
  subtitle: string;
  date: Date;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatRecordingTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function calculateOverallProgress(stats: DashboardStats): number {
  // Simple progress calculation based on activity
  const recordingScore = Math.min(stats.recordingCount * 10, 30);
  const journalScore = Math.min(stats.journalCount * 10, 30);
  const brainDumpScore = Math.min(stats.brainDumpCount * 15, 20);
  const taskScore = stats.taskCount > 0 ? Math.min((stats.tasksCompleted / stats.taskCount) * 20, 20) : 0;
  
  return Math.min(recordingScore + journalScore + brainDumpScore + taskScore, 100);
}

// ============================================================
// COMPONENTS
// ============================================================

function ProgressRing({ progress, size = 120 }: { progress: number; size?: number }) {
  const animatedProgress = useSharedValue(0);
  
  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress]);
  
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background circle */}
      <View 
        style={{
          position: 'absolute',
          width: size - strokeWidth,
          height: size - strokeWidth,
          borderRadius: (size - strokeWidth) / 2,
          borderWidth: strokeWidth,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      />
      
      {/* Progress circle (simplified - CSS approach) */}
      <View 
        style={{
          position: 'absolute',
          width: size - strokeWidth,
          height: size - strokeWidth,
          borderRadius: (size - strokeWidth) / 2,
          borderWidth: strokeWidth,
          borderColor: '#3b82f6',
          borderTopColor: progress > 25 ? '#3b82f6' : 'transparent',
          borderRightColor: progress > 50 ? '#3b82f6' : 'transparent',
          borderBottomColor: progress > 75 ? '#3b82f6' : 'transparent',
          borderLeftColor: progress > 0 ? '#3b82f6' : 'transparent',
          transform: [{ rotate: '-90deg' }],
        }}
      />
      
      {/* Center content */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 28, color: '#ffffff' }}>
          {Math.round(progress)}%
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#94a3b8' }}>
          Context Built
        </Text>
      </View>
    </View>
  );
}

function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  color,
  delay = 0,
}: { 
  icon: typeof Mic; 
  value: string; 
  label: string; 
  color: string;
  delay?: number;
}) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="flex-1"
    >
      <Card variant="glass" className="border-white/5">
        <View className="flex-row items-center mb-2">
          <View 
            className="w-8 h-8 rounded-lg items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={16} color={color} />
          </View>
        </View>
        <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
          {value}
        </Text>
        <Text className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
          {label}
        </Text>
      </Card>
    </Animated.View>
  );
}

function QuickActionCard({
  icon: Icon,
  title,
  subtitle,
  color,
  onPress,
  delay = 0,
}: {
  icon: typeof Mic;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  delay?: number;
}) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Animated.View entering={FadeInRight.delay(delay).springify().damping(15)}>
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.8}
        className="mr-3"
      >
        <Card variant="glass" className="w-40 border-white/5">
          <View 
            className="w-10 h-10 rounded-xl items-center justify-center mb-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} color={color} />
          </View>
          <Text className="text-white font-semibold text-sm" style={{ fontFamily: 'Inter_600SemiBold' }}>
            {title}
          </Text>
          <Text className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            {subtitle}
          </Text>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

function RecentActivityItem({
  item,
  delay = 0,
}: {
  item: RecentItem;
  delay?: number;
}) {
  const getIcon = () => {
    switch (item.type) {
      case 'recording': return Mic;
      case 'journal': return BookOpen;
      case 'brain-dump': return Brain;
    }
  };
  
  const getColor = () => {
    switch (item.type) {
      case 'recording': return '#3b82f6';
      case 'journal': return '#10b981';
      case 'brain-dump': return '#a855f7';
    }
  };

  const Icon = getIcon();
  const color = getColor();

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(15)}>
      <TouchableOpacity activeOpacity={0.7}>
        <View className="flex-row items-center py-3 border-b border-white/5">
          <View 
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={18} color={color} />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-white text-sm font-medium" style={{ fontFamily: 'Inter_600SemiBold' }}>
              {item.title}
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1} style={{ fontFamily: 'Inter_400Regular' }}>
              {item.subtitle}
            </Text>
          </View>
          <Text className="text-slate-500 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
            {formatRelativeDate(item.date)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalRecordingTime: 0,
    recordingCount: 0,
    journalCount: 0,
    brainDumpCount: 0,
    taskCount: 0,
    tasksCompleted: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Load recordings
      const recordings = storage.getRecordings();
      const totalRecordingTime = recordings.reduce((sum, r) => sum + (r.duration || 0), 0);
      
      // Load journals
      const journals = storage.getJournalEntries();
      
      // Load brain dumps
      const brainDumps = storage.getBrainDumps();
      
      // Load tasks
      const tasks = storage.getTasks();
      const tasksCompleted = tasks.filter(t => t.status === 'done').length;
      
      setStats({
        totalRecordingTime,
        recordingCount: recordings.length,
        journalCount: journals.length,
        brainDumpCount: brainDumps.length,
        taskCount: tasks.length,
        tasksCompleted,
      });
      
      // Build recent items (last 5)
      const allItems: RecentItem[] = [];
      
      recordings.forEach(r => {
        allItems.push({
          id: r.id,
          type: 'recording',
          title: 'Voice Recording',
          subtitle: r.transcriptionText?.slice(0, 50) || 'No transcript',
          date: new Date(r.createdAt),
        });
      });
      
      journals.forEach(j => {
        allItems.push({
          id: j.id,
          type: 'journal',
          title: 'Journal Entry',
          subtitle: j.content?.slice(0, 50) || 'No content',
          date: new Date(j.createdAt),
        });
      });
      
      brainDumps.forEach(b => {
        allItems.push({
          id: b.id,
          type: 'brain-dump',
          title: b.title || 'Brain Dump',
          subtitle: b.synthesis?.organizedContent?.slice(0, 50) || 'Processing...',
          date: new Date(b.createdAt),
        });
      });
      
      // Sort by date and take top 5
      allItems.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecentItems(allItems.slice(0, 5));
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const overallProgress = calculateOverallProgress(stats);

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
            Welcome back
          </Text>
          <Text className="text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Inter_700Bold' }}>
            Your Life Context
          </Text>
        </View>

        {/* Progress Ring */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify().damping(15)}
          className="items-center mb-8"
        >
          <ProgressRing progress={overallProgress} size={140} />
        </Animated.View>

        {/* Stats Row */}
        <View className="flex-row px-6 gap-3 mb-8">
          <StatCard
            icon={Clock}
            value={formatRecordingTime(stats.totalRecordingTime)}
            label="Recording Time"
            color="#3b82f6"
            delay={200}
          />
          <StatCard
            icon={BookOpen}
            value={stats.journalCount.toString()}
            label="Journal Entries"
            color="#10b981"
            delay={250}
          />
          <StatCard
            icon={CheckCircle2}
            value={`${stats.tasksCompleted}/${stats.taskCount}`}
            label="Tasks Done"
            color="#f59e0b"
            delay={300}
          />
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
              Quick Actions
            </Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <QuickActionCard
              icon={Mic}
              title="Record"
              subtitle="Capture thoughts"
              color="#3b82f6"
              onPress={() => router.push('/recording')}
              delay={350}
            />
            <QuickActionCard
              icon={BookOpen}
              title="Journal"
              subtitle="Daily reflection"
              color="#10b981"
              onPress={() => router.push('/(tabs)/journal')}
              delay={400}
            />
            <QuickActionCard
              icon={Brain}
              title="Brain Dump"
              subtitle="Unload ideas"
              color="#a855f7"
              onPress={() => router.push('/brain-dump')}
              delay={450}
            />
            <QuickActionCard
              icon={Sparkles}
              title="AI Insights"
              subtitle="Get analysis"
              color="#0ea5e9"
              onPress={() => router.push('/(tabs)/insights')}
              delay={500}
            />
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
              Recent Activity
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-primary-400 text-sm mr-1" style={{ fontFamily: 'Inter_600SemiBold' }}>
                View All
              </Text>
              <ChevronRight size={16} color="#60a5fa" />
            </TouchableOpacity>
          </View>

          {recentItems.length === 0 ? (
            <Card variant="glass" className="border-white/5 items-center py-8">
              <View className="w-16 h-16 rounded-full bg-slate-800 items-center justify-center mb-4">
                <Play size={28} color="#94a3b8" />
              </View>
              <Text className="text-white font-semibold text-center" style={{ fontFamily: 'Inter_600SemiBold' }}>
                No activity yet
              </Text>
              <Text className="text-slate-400 text-sm text-center mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
                Start recording to build your context
              </Text>
            </Card>
          ) : (
            <Card variant="glass" className="border-white/5 py-1">
              {recentItems.map((item, index) => (
                <RecentActivityItem
                  key={item.id}
                  item={item}
                  delay={550 + index * 50}
                />
              ))}
            </Card>
          )}
        </View>

        {/* Suggested Prompt */}
        <Animated.View 
          entering={FadeInDown.delay(700).springify().damping(15)}
          className="px-6 mt-8"
        >
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/recording')}
          >
            <Card variant="glass" className="border-primary-500/30 bg-primary-500/5">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-xl bg-primary-500/20 items-center justify-center">
                  <MessageCircle size={24} color="#3b82f6" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    Suggested Question
                  </Text>
                  <Text className="text-slate-400 text-sm mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
                    "What's on your mind right now?"
                  </Text>
                </View>
                <ChevronRight size={20} color="#60a5fa" />
              </View>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
