/**
 * TimelinePage - Visual timeline of life events and recordings
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Mic,
  FileText,
  Brain,
  Clock
} from 'lucide-react';
import { cn, formatDuration, formatRelativeTime } from '@/lib/utils';
import { db } from '@lcc/storage';
import { useNavigate } from 'react-router-dom';

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

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function groupEventsByPeriod(events: TimelineEvent[], zoom: ZoomLevel): Map<string, TimelineEvent[]> {
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

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month');
  const navigate = useNavigate();

  // Load events from database
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const timelineEvents: TimelineEvent[] = [];
      
      // Load recordings
      const recordings = await db.recordings.toArray();
      const questions = await db.questions.toArray();
      const categories = await db.categories.toArray();
      
      const questionMap = new Map(questions.map(q => [q.id, q]));
      const categoryMap = new Map(categories.map(c => [c.id, c.name]));
      
      for (const recording of recordings) {
        const question = questionMap.get(recording.questionId);
        // Handle encrypted or plain text transcription
        let transcriptPreview = '';
        const transcriptionData = recording.transcriptionText as unknown as string | { data?: string };
        if (typeof transcriptionData === 'object' && transcriptionData && 'data' in transcriptionData) {
          try {
            transcriptPreview = atob(transcriptionData.data || '').slice(0, 200);
          } catch {
            transcriptPreview = '';
          }
        } else if (typeof transcriptionData === 'string') {
          transcriptPreview = transcriptionData.slice(0, 200);
        }

        timelineEvents.push({
          id: recording.id,
          date: recording.createdAt,
          title: question?.text || 'Recording',
          type: 'recording',
          category: question?.categoryId ? categoryMap.get(question.categoryId) : undefined,
          duration: recording.duration,
          description: transcriptPreview,
        });
      }
      
      // Load journal entries
      const journals = await db.journalEntries.toArray();
      for (const journal of journals) {
        let content = '';
        const journalContent = journal.content as unknown as string | { data?: string };
        if (typeof journalContent === 'object' && journalContent && 'data' in journalContent) {
          try {
            content = atob(journalContent.data || '');
          } catch {
            content = '';
          }
        }
        
        timelineEvents.push({
          id: journal.id,
          date: journal.date,
          title: `Journal Entry`,
          type: 'journal',
          duration: journal.duration,
          description: content.slice(0, 200),
        });
      }
      
      // Load brain dumps
      const brainDumps = await db.brainDumps.toArray();
      for (const dump of brainDumps) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dumpData = dump as unknown as { title?: string; synthesis?: { organizedContent?: string } };
        timelineEvents.push({
          id: dump.id,
          date: dump.createdAt,
          title: dumpData.title || 'Brain Dump Session',
          type: 'brain-dump',
          description: dumpData.synthesis?.organizedContent?.slice(0, 200),
        });
      }
      
      // Sort by date (newest first)
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setEvents(timelineEvents);
    } catch {
      // Failed to load events - show empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Group events by period
  const groupedEvents = useMemo(() => 
    groupEventsByPeriod(events, zoomLevel), 
    [events, zoomLevel]
  );

  // Get icon for event type
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'recording':
        return <Mic className="w-4 h-4" />;
      case 'journal':
        return <FileText className="w-4 h-4" />;
      case 'brain-dump':
        return <Brain className="w-4 h-4" />;
      case 'milestone':
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Get color for event type
  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'recording':
        return 'bg-blue-500';
      case 'journal':
        return 'bg-green-500';
      case 'brain-dump':
        return 'bg-purple-500';
      case 'milestone':
        return 'bg-yellow-500';
    }
  };

  // Navigate to event source
  const handleEventClick = (event: TimelineEvent) => {
    switch (event.type) {
      case 'recording':
        navigate('/app/questions');
        break;
      case 'journal':
        navigate('/app/journal');
        break;
      case 'brain-dump':
        navigate('/app/brain-dump');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Life Timeline
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize your journey through time
          </p>
        </div>
        
        {/* Zoom controls */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['decade', 'year', 'month'] as ZoomLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setZoomLevel(level)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                zoomLevel === level
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {level}s
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Recordings</p>
          <p className="text-2xl font-bold text-blue-600">{events.filter(e => e.type === 'recording').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Journal Entries</p>
          <p className="text-2xl font-bold text-green-600">{events.filter(e => e.type === 'journal').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Brain Dumps</p>
          <p className="text-2xl font-bold text-purple-600">{events.filter(e => e.type === 'brain-dump').length}</p>
        </div>
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No events yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start recording your story to see your timeline grow
          </p>
          <button
            onClick={() => navigate('/app/questions')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Answer Questions
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          
          {/* Grouped events */}
          <div className="space-y-8">
            {Array.from(groupedEvents.entries()).map(([period, periodEvents]) => (
              <div key={period}>
                {/* Period header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center z-10">
                    <span className="text-sm font-bold text-white dark:text-gray-900">
                      {periodEvents.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {period}
                  </h3>
                </div>
                
                {/* Events in this period */}
                <div className="ml-6 pl-10 space-y-4 border-l-2 border-gray-200 dark:border-gray-700">
                  {periodEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      {/* Event dot */}
                      <div className={cn(
                        "absolute -left-[21px] top-2 w-4 h-4 rounded-full flex items-center justify-center text-white",
                        getEventColor(event.type)
                      )}>
                        {getEventIcon(event.type)}
                      </div>
                      
                      {/* Event card */}
                      <button
                        onClick={() => handleEventClick(event)}
                        className="w-full text-left bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                              {event.title}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatRelativeTime(new Date(event.date))}</span>
                              </span>
                              {event.duration && (
                                <span>{formatDuration(event.duration)}</span>
                              )}
                              {event.category && (
                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                  {event.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0",
                            getEventColor(event.type)
                          )}>
                            {getEventIcon(event.type)}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
