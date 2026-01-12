/**
 * useKeyboardShortcuts - Global keyboard shortcut handler
 */
import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ShortcutHandlers {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export function useKeyboardShortcuts(handlers?: ShortcutHandlers) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Ctrl/Cmd + key shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/app');
            break;
          case 'q':
            e.preventDefault();
            navigate('/app/questions');
            break;
          case 'b':
            e.preventDefault();
            navigate('/app/brain-dump');
            break;
          case 'i':
            e.preventDefault();
            navigate('/app/insights');
            break;
          case ',':
            e.preventDefault();
            navigate('/app/settings');
            break;
        }
      }

      // Simple key shortcuts (no modifier)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key) {
          case 'Escape':
            // Stop recording if handler provided
            handlers?.onStopRecording?.();
            break;
          case ' ':
            // Space to toggle recording (only on recording pages)
            if (location.pathname.includes('questions') || location.pathname.includes('brain-dump')) {
              e.preventDefault();
              if (handlers?.onStartRecording) {
                handlers.onStartRecording();
              }
            }
            break;
          case '?':
            // Show keyboard shortcuts help (future feature)
            console.log('Keyboard Shortcuts:', SHORTCUTS);
            break;
        }
      }
    },
    [navigate, location.pathname, handlers]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Documentation of shortcuts
export const SHORTCUTS = [
  { keys: '⌘/Ctrl + D', description: 'Go to Dashboard' },
  { keys: '⌘/Ctrl + Q', description: 'Go to Questions' },
  { keys: '⌘/Ctrl + B', description: 'Go to Brain Dump' },
  { keys: '⌘/Ctrl + I', description: 'Go to Insights' },
  { keys: '⌘/Ctrl + ,', description: 'Go to Settings' },
  { keys: 'Space', description: 'Start/stop recording (on recording pages)' },
  { keys: 'Escape', description: 'Stop recording' },
  { keys: '?', description: 'Show shortcuts (console)' },
];

export default useKeyboardShortcuts;
