import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WaveformProps {
  data: number[];
  isRecording: boolean;
  isPaused?: boolean;
  barCount?: number;
  className?: string;
}

/**
 * Animated waveform visualization for audio recording
 */
export function Waveform({
  data,
  isRecording,
  isPaused = false,
  barCount = 40,
  className,
}: WaveformProps) {
  // If we have real data, use it
  // Otherwise, generate placeholder bars for idle state
  const bars = data.length > 0 
    ? normalizeData(data, barCount)
    : Array.from({ length: barCount }, () => 0.1);

  return (
    <div
      className={cn(
        'flex items-center justify-center space-x-1 h-16',
        className
      )}
    >
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className={cn(
            'w-1 rounded-full',
            isRecording && !isPaused
              ? 'bg-gradient-to-t from-blue-500 to-purple-500'
              : isPaused
              ? 'bg-gradient-to-t from-yellow-500 to-orange-500 opacity-70'
              : 'bg-gray-300 dark:bg-gray-600'
          )}
          initial={{ height: '10%' }}
          animate={{
            height: `${Math.max(10, height * 100)}%`,
            opacity: isPaused ? 0.7 : 1,
          }}
          transition={{
            duration: 0.1,
            ease: 'easeOut',
          }}
          style={
            isRecording && !isPaused
              ? {
                  animation: `waveform-bar 0.8s ease-in-out infinite`,
                  animationDelay: `${(index % 5) * 0.1}s`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

/**
 * Normalize waveform data to target bar count
 */
function normalizeData(data: number[], targetCount: number): number[] {
  if (data.length === 0) return Array(targetCount).fill(0.1);
  if (data.length === targetCount) return data;

  const normalized: number[] = [];
  const ratio = data.length / targetCount;

  for (let i = 0; i < targetCount; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    const slice = data.slice(start, Math.max(end, start + 1));
    
    // Use max absolute value for better visualization
    const max = Math.max(...slice.map(Math.abs));
    normalized.push(max);
  }

  return normalized;
}

export default Waveform;
