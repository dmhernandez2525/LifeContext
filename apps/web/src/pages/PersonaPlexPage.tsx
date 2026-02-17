/**
 * PersonaPlexPage - AI conversational interface.
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { ChatMessageBubble, ChatInput, ConversationList } from '@/components/ai';
import { useChatStore } from '@/store/chat-store';
import { useHealthStore } from '@/store/health-store';
import {
  createMessage,
  generateLocalResponse,
  type MessageContext,
} from '@/lib/personaPlex';

export default function PersonaPlexPage() {
  const {
    conversations, activeConversationId,
    startConversation, addMessage,
  } = useChatStore();
  const { entries: healthEntries } = useHealthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const context = useMemo<MessageContext>(() => {
    const recentHealth = healthEntries.slice(-7);
    const healthSummary = recentHealth.length > 0
      ? `${recentHealth.length} health entries in the last week`
      : undefined;
    return { healthSummary };
  }, [healthEntries]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length]);

  const handleSend = useCallback((content: string) => {
    let convoId = activeConversationId;
    if (!convoId) {
      convoId = startConversation();
    }

    const userMessage = createMessage('user', content, context);
    addMessage(convoId, userMessage);

    setTimeout(() => {
      const response = generateLocalResponse(content, context);
      const assistantMessage = createMessage('assistant', response);
      addMessage(convoId!, assistantMessage);
    }, 300 + Math.random() * 400);
  }, [activeConversationId, startConversation, addMessage, context]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
          <Bot className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">PersonaPlex</h1>
          <p className="text-sm text-gray-500">Your AI life companion</p>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto">
          <ConversationList />
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {activeConversation ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.messages.length === 0 && (
                  <div className="text-center py-12">
                    <Bot className="w-12 h-12 text-amber-300 dark:text-amber-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Start a conversation. Ask about your journal, health, or just reflect.
                    </p>
                  </div>
                )}
                {activeConversation.messages.map(msg => (
                  <ChatMessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <ChatInput onSend={handleSend} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-2">Select or start a conversation</p>
                <button
                  onClick={() => startConversation()}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  New Conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
