/**
 * ConversationList - Sidebar showing past conversations.
 */
import { Plus, Trash2, MessageCircle } from 'lucide-react';
import { useChatStore } from '@/store/chat-store';
import { cn } from '@/lib/utils';

export function ConversationList() {
  const {
    conversations,
    activeConversationId,
    startConversation,
    setActiveConversation,
    deleteConversation,
  } = useChatStore();

  return (
    <div className="space-y-2">
      <button
        onClick={() => startConversation()}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <Plus className="w-4 h-4" /> New Conversation
      </button>

      {conversations.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No conversations yet</p>
      )}

      <div className="space-y-1">
        {conversations.map(convo => (
          <div
            key={convo.id}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors",
              activeConversationId === convo.id
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            )}
          >
            <button
              onClick={() => setActiveConversation(convo.id)}
              className="flex items-center gap-2 flex-1 min-w-0 text-left"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{convo.title}</p>
                <p className="text-xs text-gray-400 truncate">
                  {convo.messages.length} messages
                </p>
              </div>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
