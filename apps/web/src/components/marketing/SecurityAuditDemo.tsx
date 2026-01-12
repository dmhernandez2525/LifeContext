/**
 * SecurityAuditDemo - Real-time encryption visualization
 *
 * Shows users exactly what's happening with their data through
 * a simulated security audit log with realistic encryption events.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Key, Eye, Database, Cloud, CheckCircle, Server } from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: Date;
  type: 'encrypt' | 'hash' | 'derive' | 'store' | 'sync' | 'verify';
  message: string;
  details?: string;
  status: 'processing' | 'complete';
}

const DEMO_EVENTS: Omit<AuditEvent, 'id' | 'timestamp' | 'status'>[] = [
  { type: 'derive', message: 'Deriving encryption key from passcode', details: 'PBKDF2-SHA256 • 100,000 iterations' },
  { type: 'hash', message: 'Generating salt for key derivation', details: '256-bit random salt' },
  { type: 'encrypt', message: 'Encrypting voice recording', details: 'AES-256-GCM • 12-byte IV' },
  { type: 'hash', message: 'Computing integrity hash', details: 'SHA-256 checksum' },
  { type: 'store', message: 'Writing encrypted blob to IndexedDB', details: 'Local-first storage' },
  { type: 'verify', message: 'Verifying encryption integrity', details: 'Auth tag validated' },
  { type: 'encrypt', message: 'Encrypting transcription text', details: 'AES-256-GCM • Zero-knowledge' },
  { type: 'derive', message: 'Deriving privacy-level key', details: 'HKDF-SHA256 expansion' },
  { type: 'sync', message: 'Preparing encrypted sync blob', details: 'Server sees only opaque data' },
  { type: 'store', message: 'Caching decryption key in memory', details: 'Never persisted to disk' },
  { type: 'hash', message: 'Generating blob identifier', details: 'Content-addressable hash' },
  { type: 'encrypt', message: 'Encrypting journal entry', details: 'AES-256-GCM • Client-side only' },
  { type: 'verify', message: 'Validating passcode hash', details: 'Constant-time comparison' },
  { type: 'derive', message: 'Generating recovery key shards', details: "Shamir's Secret Sharing (3-of-5)" },
  { type: 'sync', message: 'Uploading encrypted backup', details: 'E2E encrypted • We cannot read it' },
];

function getEventIcon(type: AuditEvent['type']) {
  switch (type) {
    case 'encrypt':
      return <Lock className="w-4 h-4" />;
    case 'hash':
      return <Shield className="w-4 h-4" />;
    case 'derive':
      return <Key className="w-4 h-4" />;
    case 'store':
      return <Database className="w-4 h-4" />;
    case 'sync':
      return <Cloud className="w-4 h-4" />;
    case 'verify':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Server className="w-4 h-4" />;
  }
}

function getEventColor(type: AuditEvent['type']) {
  switch (type) {
    case 'encrypt':
      return 'text-blue-400 bg-blue-500/10';
    case 'hash':
      return 'text-purple-400 bg-purple-500/10';
    case 'derive':
      return 'text-amber-400 bg-amber-500/10';
    case 'store':
      return 'text-green-400 bg-green-500/10';
    case 'sync':
      return 'text-cyan-400 bg-cyan-500/10';
    case 'verify':
      return 'text-emerald-400 bg-emerald-500/10';
    default:
      return 'text-gray-400 bg-gray-500/10';
  }
}

export default function SecurityAuditDemo() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventIndexRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const addEvent = () => {
      const eventTemplate = DEMO_EVENTS[eventIndexRef.current % DEMO_EVENTS.length];
      eventIndexRef.current++;

      const newEvent: AuditEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        status: 'processing',
        ...eventTemplate,
      };

      setEvents((prev) => {
        const updated = [...prev, newEvent].slice(-15); // Keep last 15 events
        return updated;
      });

      // Mark as complete after delay
      setTimeout(() => {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === newEvent.id ? { ...e, status: 'complete' as const } : e
          )
        );
      }, 800);
    };

    // Add initial events
    if (events.length === 0) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => addEvent(), i * 300);
      }
    }

    // Add new events periodically
    const interval = setInterval(addEvent, 2500);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Security Audit Log
          </span>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Log Container */}
      <div
        ref={scrollRef}
        className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 border-b border-gray-800">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-gray-500 font-mono ml-2">
            lifecontext://security-monitor
          </span>
        </div>

        {/* Events */}
        <div className="p-4 h-[300px] overflow-y-auto font-mono text-sm space-y-2">
          <AnimatePresence mode="popLayout">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-3"
              >
                {/* Timestamp */}
                <span className="text-gray-600 text-xs shrink-0 pt-0.5">
                  [{formatTime(event.timestamp)}]
                </span>

                {/* Icon */}
                <div className={`shrink-0 p-1 rounded ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200">{event.message}</span>
                    {event.status === 'processing' && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-yellow-400 text-xs"
                      >
                        ...
                      </motion.span>
                    )}
                    {event.status === 'complete' && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-400 text-xs"
                      >
                        done
                      </motion.span>
                    )}
                  </div>
                  {event.details && (
                    <span className="text-gray-500 text-xs block mt-0.5">
                      {event.details}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Cursor */}
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-gray-400"
          />
        </div>
      </div>

      {/* Footer Badge */}
      <div className="mt-4 flex items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-300">
            All encryption happens <strong className="text-white">on your device</strong>
          </span>
          <Eye className="w-4 h-4 text-gray-500 line-through" />
        </div>
      </div>
    </div>
  );
}
