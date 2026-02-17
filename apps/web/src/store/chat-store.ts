/**
 * Chat store for PersonaPlex AI conversations.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, ChatMessage } from '@/lib/personaPlex';
import { createConversation, generateTitle } from '@/lib/personaPlex';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;

  startConversation: () => string;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      activeConversationId: null,

      startConversation: () => {
        const convo = createConversation();
        set((state) => ({
          conversations: [convo, ...state.conversations],
          activeConversationId: convo.id,
        }));
        return convo.id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map(c => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages, message];
            const needsTitle = c.title === 'New Conversation' && message.role === 'user';
            return {
              ...c,
              messages,
              title: needsTitle ? generateTitle(message.content) : c.title,
              updatedAt: Date.now(),
            };
          }),
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter(c => c.id !== id),
          activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
        })),

      clearAll: () => set({ conversations: [], activeConversationId: null }),
    }),
    { name: 'lcc-chat' }
  )
);
