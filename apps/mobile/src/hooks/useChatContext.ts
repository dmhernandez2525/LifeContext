import { useState, useCallback } from 'react';
import { getSettings, getJournalEntries, getBrainDumps } from '../lib/storage';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function useChatContext() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const settings = getSettings();
    const apiKey = settings.apiKey;
    
    // Optimistic Update
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
        if (!apiKey) {
            // Demo Mode Response
            await new Promise(resolve => setTimeout(resolve, 1500));
            const demoResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm currently in demo mode. Connect your Anthropic API Key in settings to let me analyze your actual life context! Based on your journal entries, it seems you value productivity and clarity.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, demoResponse]);
            return;
        }

        // Gather Context
        const recentJournals = getJournalEntries().slice(0, 5).map(j => `[${j.date}] ${j.content}`).join('\n');
        const recentDumps = getBrainDumps().slice(0, 3).map(d => `[Brain Dump] ${d.bulletPoints.join(', ')}`).join('\n');
        
        const systemPrompt = `You are a Life Context AI Assistant. You have access to the user's recent journals and brain dumps.
        
        Recent Context:
        ${recentJournals}
        ${recentDumps}
        
        Answer the user's question based on this context. Be insightful, empathetic, and concise.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1024,
                messages: [
                    { role: 'user', content: systemPrompt + "\n\nUser Question: " + content }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.content[0].text,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);

    } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to send message');
        // Add error message to chat
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: "Sorry, I encountered an error connecting to the AI. Please check your internet or API key.",
            timestamp: new Date().toISOString()
        }]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
}
