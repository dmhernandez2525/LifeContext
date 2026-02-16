/**
 * ChatMessage - Renders a single chat message bubble.
 */
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/personaPlex';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser
          ? "bg-indigo-100 dark:bg-indigo-900/40"
          : "bg-amber-100 dark:bg-amber-900/40"
      )}>
        {isUser
          ? <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          : <Bot className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        }
      </div>
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2.5",
        isUser
          ? "bg-indigo-600 text-white rounded-br-md"
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={cn(
          "text-xs mt-1",
          isUser ? "text-indigo-200" : "text-gray-400"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
