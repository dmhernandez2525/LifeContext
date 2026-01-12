import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Mic, BookOpen, Brain, Calendar, Clock } from 'lucide-react-native';
import * as storage from '../../src/lib/storage';
import { Card } from '../../src/components/ui';

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

  // Load events from storage
  const loadEvents = useCallback(async () => {
    setIsLoading(true);

    try {
      const timelineEvents: TimelineEvent[] = [];

      // Load recordings
      const recordings = await storage.getRecordings();
      for (const recording of recordings) {
        timelineEvents.push({
          id: recording.id,
          date: new Date(recording.timestamp),
          title: 'Recording',
          type: 'recording',
          duration: recording.duration,
          description: recording.transcription?.slice(0, 100),
        });
      }

      // Load journal entries
      const journals = await storage.getJournalEntries();
      for (const journal of journals) {
        timelineEvents.push({
          id: journal.id,
          date: new Date(journal.timestamp),
          title: 'Journal Entry',
          type: 'journal',
          duration: journal.duration,
          description: journal.content?.slice(0, 100),
        });
      }

      // Load brain dumps
      const brainDumps = await storage.getBrainDumps();
      for (const dump of brainDumps) {
        timelineEvents.push({
          id: dump.id,
          date: new Date(dump.timestamp),
          title: dump.title || 'Brain Dump Session',
          type: 'brain-dump',
          description: dump.organizedThoughts?.slice(0, 100),
        });
      }

      // Sort by date (newest first)
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

  // Group events by period and flatten for FlashList
  const flattenedData = useMemo(() => {
    const grouped = groupEventsByPeriod(events, zoomLevel);
    const flattened: GroupedEvent[] = [];

    for (const [period, periodEvents] of Array.from(grouped.entries())) {
      // Add period header
      flattened.push({
        type: 'period',
        period,
        eventCount: periodEvents.length,
      });

      // Add events
      periodEvents.forEach((event, index) => {
        flattened.push({
          type: 'event',
          event,
          index,
        });
      });
    }

    return flattened;
  }, [events, zoomLevel]);

  const stats = useMemo(
    () => ({
      total: events.length,
      recordings: events.filter((e) => e.type === 'recording').length,
      journals: events.filter((e) => e.type === 'journal').length,
      brainDumps: events.filter((e) => e.type === 'brain-dump').length,
    }),
    [events]
  );

  const renderItem = useCallback(
    ({ item }: { item: GroupedEvent }) => {
      if (item.type === 'period') {
        return (
          <View className="flex-row items-center mb-4 mt-6">
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center">
              <Text className="text-sm font-bold text-gray-900">
                {item.eventCount}
              </Text>
            </View>
            <Text className="ml-4 text-xl font-bold text-white">
              {item.period}
            </Text>
          </View>
        );
      }

      const event = item.event!;
      const eventColor = getEventColor(event.type);

      return (
        <Animated.View
          entering={FadeInRight.delay((item.index || 0) * 50)}
          className="ml-6 mb-4"
        >
          <View className="relative">
            {/* Event dot */}
            <View
              className="absolute -left-[30px] top-2 w-4 h-4 rounded-full items-center justify-center"
              style={{ backgroundColor: eventColor }}
            >
              <EventIcon type={event.type} />
            </View>

            {/* Event card */}
            <Card variant="default" className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <Text className="text-white font-medium mb-1">
                    {event.title}
                  </Text>
                  {event.description && (
                    <Text
                      className="text-dark-text-secondary text-sm"
                      numberOfLines={2}
                    >
                      {event.description}
                    </Text>
                  )}
                  <View className="flex-row items-center mt-2 space-x-3">
                    <View className="flex-row items-center">
                      <Clock size={12} color="#64748b" />
                      <Text className="text-dark-text-secondary text-xs ml-1">
                        {formatRelativeTime(event.date)}
                      </Text>
                    </View>
                    {event.duration && (
                      <Text className="text-dark-text-secondary text-xs">
                        {formatDuration(event.duration)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Icon badge */}
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: eventColor }}
                >
                  <EventIcon type={event.type} />
                </View>
              </View>
            </Card>
          </View>
        </Animated.View>
      );
    },
    []
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-background" edges={['bottom']}>
      {/* Stats */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 pt-4 max-h-24"
      >
        <View className="flex-row space-x-3 pb-4">
          <Card variant="default" className="w-32 p-3">
            <Text className="text-dark-text-secondary text-xs">Total</Text>
            <Text className="text-white text-2xl font-bold">{stats.total}</Text>
          </Card>
          <Card variant="default" className="w-32 p-3">
            <Text className="text-dark-text-secondary text-xs">Recordings</Text>
            <Text className="text-blue-600 text-2xl font-bold">
              {stats.recordings}
            </Text>
          </Card>
          <Card variant="default" className="w-32 p-3">
            <Text className="text-dark-text-secondary text-xs">Journals</Text>
            <Text className="text-green-600 text-2xl font-bold">
              {stats.journals}
            </Text>
          </Card>
          <Card variant="default" className="w-32 p-3">
            <Text className="text-dark-text-secondary text-xs">Brain Dumps</Text>
            <Text className="text-purple-600 text-2xl font-bold">
              {stats.brainDumps}
            </Text>
          </Card>
        </View>
      </ScrollView>

      {/* Zoom controls */}
      <View className="flex-row items-center px-4 py-3 space-x-2">
        {(['decade', 'year', 'month'] as ZoomLevel[]).map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setZoomLevel(level)}
            className={`px-4 py-2 rounded-lg ${
              zoomLevel === level
                ? 'bg-primary-600'
                : 'bg-dark-surface border border-dark-border'
            }`}
          >
            <Text
              className={`text-sm font-medium capitalize ${
                zoomLevel === level ? 'text-white' : 'text-dark-text-secondary'
              }`}
            >
              {level}s
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeline */}
      {events.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Calendar size={48} color="#64748b" />
          <Text className="text-white text-lg font-semibold mt-4 mb-2">
            No events yet
          </Text>
          <Text className="text-dark-text-secondary text-center">
            Start recording your story to see your timeline grow
          </Text>
        </View>
      ) : (
        <View className="flex-1 relative px-4">
          {/* Vertical timeline line */}
          <View className="absolute left-[30px] top-0 bottom-0 w-0.5 bg-dark-border z-0" />

          {/* Events list */}
          <FlashList
            data={flattenedData}
            renderItem={renderItem}
            estimatedItemSize={120}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
