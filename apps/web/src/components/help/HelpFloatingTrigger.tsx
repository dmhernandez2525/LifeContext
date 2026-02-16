import { type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { motion } from 'framer-motion';
import { MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import HelpOnboardingTooltip from './HelpOnboardingTooltip';

interface HelpFloatingTriggerProps {
  className?: string;
  isMinimized: boolean;
  unreadCount: number;
  style: CSSProperties;
  position: { x: number; y: number };
  showTooltip: boolean;
  setTriggerElement: (element: HTMLElement | null) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onOpen: () => void;
  onDismissTooltip: () => void;
}

export default function HelpFloatingTrigger({
  className,
  isMinimized,
  unreadCount,
  style,
  position,
  showTooltip,
  setTriggerElement,
  onPointerDown,
  onOpen,
  onDismissTooltip,
}: HelpFloatingTriggerProps) {
  return (
    <>
      <motion.button
        ref={setTriggerElement}
        type="button"
        onPointerDown={onPointerDown}
        onClick={onOpen}
        data-testid={isMinimized ? 'ask-docs-pill' : 'ask-docs-toggle'}
        className={cn(
          'fixed z-[60] flex items-center justify-center text-white shadow-lg select-none',
          isMinimized
            ? 'h-11 min-w-[120px] gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4'
            : 'h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600',
          className
        )}
        style={style}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircleQuestion className="h-5 w-5" />
        {isMinimized && <span className="text-xs font-semibold">Ask Docs</span>}
        {isMinimized && unreadCount > 0 && (
          <span data-testid="ask-docs-unread" className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-semibold">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <HelpOnboardingTooltip
        isVisible={showTooltip}
        anchor={position}
        onDismiss={onDismissTooltip}
        onOpen={onOpen}
      />
    </>
  );
}
