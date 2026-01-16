/**
 * AIChat Component - Chat interface for AI insights
 * 
 * Features:
 * - Message bubbles with user/assistant distinction
 * - Suggested prompt chips
 * - Context loading indicator
 * - Clear conversation button
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  Brain,
  MessageCircle,
  Lightbulb,
} from 'lucide-react-native';

// ============================================================
// TYPES
// ============================================================

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  onSendMessage: (message: string) => Promise<string>;
  isLoading?: boolean;
  contextLoading?: boolean;
  contextSummary?: string;
}

// ============================================================
// SUGGESTED PROMPTS
// ============================================================

const SUGGESTED_PROMPTS = [
  { icon: Lightbulb, text: "What patterns do you see?", color: "#f59e0b" },
  { icon: Brain, text: "Summarize my recent thoughts", color: "#a855f7" },
  { icon: MessageCircle, text: "What should I reflect on?", color: "#3b82f6" },
];

// ============================================================
// MESSAGE BUBBLE
// ============================================================

interface MessageBubbleProps {
  message: Message;
  index: number;
}

function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(15)}
      className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-sky-500/20 items-center justify-center mr-2 mt-1">
          <Sparkles size={16} color="#0ea5e9" />
        </View>
      )}
      
      <View 
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-primary-500 rounded-br-md' 
            : 'bg-slate-800 border border-white/5 rounded-bl-md'
        }`}
      >
        <Text 
          className={`text-base leading-6 ${isUser ? 'text-white' : 'text-slate-200'}`}
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {message.content}
        </Text>
        <Text 
          className={`text-xs mt-1 ${isUser ? 'text-white/60' : 'text-slate-500'}`}
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      {isUser && (
        <View className="w-8 h-8 rounded-full bg-primary-500/20 items-center justify-center ml-2 mt-1">
          <User size={16} color="#3b82f6" />
        </View>
      )}
    </Animated.View>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function AIChat({ 
  onSendMessage, 
  isLoading = false, 
  contextLoading = false,
  contextSummary,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hi! I'm your personal AI assistant. I've analyzed your recordings, journal entries, and notes. Ask me anything about your life context!",
          timestamp: new Date(),
        }
      ]);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Get AI response
    try {
      const response = await onSendMessage(userMessage.content);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText, isLoading, onSendMessage]);

  const handlePromptPress = useCallback((prompt: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setInputText(prompt);
  }, []);

  const handleClear = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setMessages([
      {
        id: 'welcome-new',
        role: 'assistant',
        content: "Conversation cleared. How can I help you?",
        timestamp: new Date(),
      }
    ]);
  }, []);

  return (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      {/* Context Loading Indicator */}
      {contextLoading && (
        <Animated.View 
          entering={FadeInDown.duration(200)}
          className="px-6 py-3 bg-sky-500/10 border-b border-sky-500/20"
        >
          <View className="flex-row items-center">
            <ActivityIndicator color="#0ea5e9" size="small" />
            <Text className="text-sky-400 text-sm ml-3" style={{ fontFamily: 'Inter_400Regular' }}>
              Loading your context...
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Context Summary */}
      {contextSummary && !contextLoading && (
        <Animated.View 
          entering={FadeInDown.duration(200)}
          className="px-6 py-3 bg-slate-800/50 border-b border-white/5"
        >
          <Text className="text-slate-400 text-xs" style={{ fontFamily: 'Inter_400Regular' }}>
            {contextSummary}
          </Text>
        </Animated.View>
      )}

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <MessageBubble message={item} index={index} />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          messages.length <= 1 ? (
            <View className="mb-4">
              <Text className="text-slate-400 text-sm text-center mb-4" style={{ fontFamily: 'Inter_600SemiBold' }}>
                SUGGESTED PROMPTS
              </Text>
              <View className="flex-row flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((prompt, i) => {
                  const IconComponent = prompt.icon;
                  return (
                    <Animated.View 
                      key={i}
                      entering={FadeInRight.delay(i * 100).springify().damping(15)}
                    >
                      <TouchableOpacity
                        onPress={() => handlePromptPress(prompt.text)}
                        className="flex-row items-center px-4 py-2 bg-slate-800 rounded-full border border-white/5"
                      >
                        <IconComponent size={14} color={prompt.color} />
                        <Text className="text-slate-300 text-sm ml-2" style={{ fontFamily: 'Inter_400Regular' }}>
                          {prompt.text}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          ) : null
        }
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View className="px-4 py-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-sky-500/20 items-center justify-center mr-2">
              <Sparkles size={16} color="#0ea5e9" />
            </View>
            <View className="bg-slate-800 rounded-2xl px-4 py-3 rounded-bl-md">
              <ActivityIndicator color="#0ea5e9" size="small" />
            </View>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View className="px-4 py-3 border-t border-white/5 bg-slate-900/50">
        <View className="flex-row items-center gap-3">
          {/* Clear Button */}
          <TouchableOpacity
            onPress={handleClear}
            className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center"
            disabled={messages.length <= 1}
            style={{ opacity: messages.length <= 1 ? 0.4 : 1 }}
          >
            <RotateCcw size={18} color="#94a3b8" />
          </TouchableOpacity>
          
          {/* Text Input */}
          <View className="flex-1 bg-slate-800 rounded-full border border-white/5 px-4 py-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your life context..."
              placeholderTextColor="#64748b"
              className="text-white text-base"
              style={{ fontFamily: 'Inter_400Regular' }}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!isLoading}
            />
          </View>
          
          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              inputText.trim() && !isLoading ? 'bg-primary-500' : 'bg-slate-800'
            }`}
            disabled={!inputText.trim() || isLoading}
          >
            <Send 
              size={18} 
              color={inputText.trim() && !isLoading ? '#ffffff' : '#64748b'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
