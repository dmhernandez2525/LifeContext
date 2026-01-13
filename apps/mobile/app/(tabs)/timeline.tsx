/**
 * Timeline Screen - Visual timeline of all life events
 * 
 * Moved from index.tsx to be a dedicated tab accessible from RocketTabBar.
 * Features zoom levels (decade/year/month), filters, and grouped events.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTabBar } from '../../src/context/TabBarContext';
import { Mic, BookOpen, Brain, Calendar, Clock } from 'lucide-react-native';
import * as storage from '../../src/lib/storage';
import { Card } from '../../src/components/ui';
import { AddEventSheet } from '../../src/components/timeline/AddEventSheet';

// ============================================================
// TYPES
// ============================================================

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  type: 'recording' | 'journal' | 'brain-dump' | 'milestone';
  category?: string;
  duration?: number;
  description?: string;
}

type ZoomLevel = 'decade' | 'year' | 'month';

interface GroupedEvent {
  type: 'period' | 'event';
  period?: string;
  eventCount?: number;
  event?: TimelineEvent;
  index?: number;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function groupEventsByPeriod(
  events: TimelineEvent[],
  zoom: ZoomLevel
): Map<string, TimelineEvent[]> {
  const groups = new Map<string, TimelineEvent[]>();

  for (const event of events) {
    const date = new Date(event.date);
    let key: string;

    switch (zoom) {
      case 'decade':
        key = `${Math.floor(date.getFullYear() / 10) * 10}s`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      case 'month':
        key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        break;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(event);
  }

  return groups;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================
// COMPONENTS
// ============================================================

function EventIcon({ type }: { type: TimelineEvent['type'] }) {
  const iconProps = { size: 16, color: '#ffffff', strokeWidth: 2 };

  switch (type) {
    case 'recording':
      return <Mic {...iconProps} />;
    case 'journal':
      return <BookOpen {...iconProps} />;
    case 'brain-dump':
      return <Brain {...iconProps} />;
    case 'milestone':
      return <Calendar {...iconProps} />;
  }
}

function getEventColor(type: TimelineEvent['type']): string {
  switch (type) {
    case 'recording':
      return '#3b82f6'; // blue
    case 'journal':
      return '#10b981'; // green
    case 'brain-dump':
      return '#a855f7'; // purple
    case 'milestone':
      return '#f59e0b'; // yellow
  }
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TimelineScreen() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month');
  const [activeFilter, setActiveFilter] = useState<'all' | 'recording' | 'journal' | 'brain-dump' | 'milestone'>('all');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const { fabActionTrigger } = useTabBar();

  useEffect(() => {
    if (fabActionTrigger > 0) {
      setShowAddEvent(true);
    }
  }, [fabActionTrigger]);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);

    try {
      const timelineEvents: TimelineEvent[] = [];

      const recordings = await storage.getRecordings();
      for (const recording of recordings) {
        timelineEvents.push({
          id: recording.id,
          date: new Date(recording.createdAt),
          title: 'Voice Recording',
          type: 'recording',
          duration: recording.duration,
          description: recording.transcriptionText?.slice(0, 100),
        });
      }

      const journals = await storage.getJournalEntries();
      for (const journal of journals) {
        timelineEvents.push({
          id: journal.id,
          date: new Date(journal.createdAt),
          title: 'Journal Entry',
          type: 'journal',
          description: journal.content?.slice(0, 150),
        });
      }

      const brainDumps = await storage.getBrainDumps();
      for (const dump of brainDumps) {
        timelineEvents.push({
          id: dump.id,
          date: new Date(dump.createdAt),
          title: dump.title || 'Brain Dump',
          type: 'brain-dump',
          description: dump.synthesis?.organizedContent?.slice(0, 100),
        });
      }

      timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
      setEvents(timelineEvents);
    } catch (err) {
      console.error('Failed to load timeline events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return events;
    return events.filter(e => e.type === activeFilter);
  }, [events, activeFilter]);

  const flattenedData = useMemo(() => {
    const grouped = groupEventsByPeriod(filteredEvents, zoomLevel);
    const flattened: GroupedEvent[] = [];

    for (const [period, periodEvents] of Array.from(grouped.entries())) {
      flattened.push({ type: 'period', period, eventCount: periodEvents.length });
      periodEvents.forEach((event, index) => {
        flattened.push({ type: 'event', event, index });
      });
    }

    return flattened;
  }, [filteredEvents, zoomLevel]);

  const renderItem = useCallback(
    ({ item }: { item: GroupedEvent }) => {
      if (item.type === 'period') {
        return (
          <View className="flex-row items-center mb-6 mt-8">
            <View 
              className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center border-4 border-slate-900 z-10"
              style={{ shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 }}
            >
              <Text className="text-white text-xs font-bold" style={{ fontFamily: 'Inter_700Bold' }}>
                {item.eventCount}
              </Text>
            </View>
            <View className="ml-4 px-3 py-1 bg-slate-800/50 rounded-full border border-white/5">
              <Text className="text-sm font-bold text-slate-300 uppercase tracking-widest" style={{ fontFamily: 'Inter_700Bold' }}>
                {item.period}
              </Text>
            </View>
          </View>
        );
      }

      const event = item.event!;
      const eventColor = getEventColor(event.type);

      return (
        <View className="relative ml-5 pl-8 pb-8 border-l border-white/10">
          <View className="absolute -left-[0.5px] top-0 bottom-0 w-[1px] bg-white/20" />
          <View
            className="absolute -left-[14px] top-1 w-7 h-7 rounded-full items-center justify-center border-4 border-slate-900 z-20"
            style={{ 
              backgroundColor: eventColor,
              shadowColor: eventColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 8
            }}
          >
            <EventIcon type={event.type} />
          </View>

          <Animated.View entering={FadeInRight.delay((item.index || 0) * 100).springify().damping(15)}>
            <TouchableOpacity activeOpacity={0.9}>
              <Card variant="glass" className="border-white/5">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-4">
                    <Text className="text-white text-base font-semibold" style={{ fontFamily: 'Inter_600SemiBold' }}>
                      {event.title}
                    </Text>
                    
                    {event.description && (
                      <Text className="text-slate-400 text-sm leading-5 mb-3 mt-1" numberOfLines={3} style={{ fontFamily: 'Inter_400Regular' }}>
                        {event.description}
                      </Text>
                    )}

                    <View className="flex-row items-center space-x-4">
                      <View className="flex-row items-center opacity-60">
                        <Clock size={12} color="#94a3b8" />
                        <Text className="text-slate-400 text-xs ml-1" style={{ fontFamily: 'Inter_400Regular' }}>
                          {formatRelativeTime(event.date)}
                        </Text>
                      </View>
                      
                      {event.duration && (
                        <View className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                          <Text className="text-slate-500 text-[10px] font-bold">
                            {formatDuration(event.duration)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View className="p-2 rounded-xl opacity-80" style={{ backgroundColor: `${eventColor}20` }}>
                    <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: eventColor }}>
                      <EventIcon type={event.type} />
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    },
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
            Life Timeline
          </Text>
          <Text className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            {events.length} memory nodes archived
          </Text>
        </View>
        <TouchableOpacity className="w-10 h-10 bg-slate-900 rounded-full items-center justify-center border border-white/5">
          <Calendar size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <View className="mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
          {['all', 'recording', 'journal', 'brain-dump'].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter as any)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                activeFilter === filter ? 'bg-primary-500/20 border-primary-500' : 'bg-white/5 border-white/5'
              }`}
            >
              <Text 
                className={`text-xs capitalize ${activeFilter === filter ? 'text-primary-400' : 'text-slate-400'}`}
                style={{ fontFamily: activeFilter === filter ? 'Inter_600SemiBold' : 'Inter_400Regular' }}
              >
                {filter.replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="px-6 pb-2">
        <View className="bg-slate-900/50 p-1 rounded-2xl flex-row border border-white/5">
          {(['decade', 'year', 'month'] as ZoomLevel[]).map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setZoomLevel(level)}
              className={`flex-1 items-center justify-center py-2.5 rounded-xl ${
                zoomLevel === level ? 'bg-slate-800 border border-white/10' : ''
              }`}
            >
              <Text 
                className={`text-[13px] capitalize ${zoomLevel === level ? 'text-white' : 'text-slate-500'}`}
                style={{ fontFamily: zoomLevel === level ? 'Inter_600SemiBold' : 'Inter_400Regular' }}
              >
                {level}s
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-1 px-3">
        {events.length === 0 && !isLoading ? (
          <View className="flex-1 items-center justify-center px-12 opacity-40">
            <View className="w-20 h-20 bg-slate-900 rounded-full items-center justify-center mb-6">
              <Clock size={40} color="#94a3b8" />
            </View>
            <Text className="text-white text-lg font-bold text-center mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
              The Archive is Empty
            </Text>
            <Text className="text-slate-400 text-sm text-center" style={{ fontFamily: 'Inter_400Regular' }}>
              Capture your first moment to begin building your timeline.
            </Text>
          </View>
        ) : (
          <FlashList
            data={flattenedData}
            renderItem={renderItem}
            estimatedItemSize={160}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            onRefresh={loadEvents}
            refreshing={isLoading}
          />
        )}
      </View>
      {/* Add Event Sheet */}
      <AddEventSheet
        visible={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onSave={loadEvents}
      />
    </SafeAreaView>
  );
}
