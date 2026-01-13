import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { Send, Sparkles, User, Bot, MessageSquare } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useChatContext, ChatMessage } from '../../hooks/useChatContext';
import { Card } from '../ui';

const SUGGESTED_PROMPTS = [
    "What are my recurring themes?",
    "How has my mood changed this week?",
    "Summarize my recent brain dumps",
    "What should I focus on next?",
    "Am I making progress on my values?"
];

export function ChatInterface() {
  const { messages, isLoading, sendMessage } = useChatContext();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === 'user';
      return (
          <Animated.View entering={FadeInUp.duration(300)} className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                  <View className="w-8 h-8 rounded-full bg-indigo-500/20 items-center justify-center mr-2 mt-1">
                      <Sparkles size={14} color="#818cf8" />
                  </View>
              )}
              <View 
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${isUser ? 'bg-indigo-600 rounded-tr-sm' : 'bg-slate-800 rounded-tl-sm'}`}
              >
                  <Text className="text-white text-sm leading-5" style={{ fontFamily: 'Inter_400Regular' }}>
                      {item.content}
                  </Text>
                  <Text className="text-[10px] text-white/30 mt-1 text-right">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
              </View>
              {isUser && (
                  <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center ml-2 mt-1">
                      <User size={14} color="#cbd5e1" />
                  </View>
              )}
          </Animated.View>
      );
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        keyboardVerticalOffset={120}
        className="flex-1"
    >
        {messages.length === 0 ? (
           <ScrollView className="flex-1 px-4">
                <View className="items-center py-10 opacity-50">
                    <MessageSquare size={48} color="#64748b" />
                    <Text className="text-slate-400 font-bold mt-4 text-center">Ask Your Context</Text>
                    <Text className="text-slate-600 text-xs text-center mt-2 max-w-xs">
                        I can analyze your journals and brain dumps to answer questions about your life patterns.
                    </Text>
                </View>

                <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3 ml-1">Suggested Questions</Text>
                <View className="flex-row flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <TouchableOpacity 
                            key={i} 
                            onPress={() => sendMessage(prompt)}
                            className="bg-slate-800/50 border border-white/5 px-3 py-2 rounded-full"
                        >
                            <Text className="text-slate-300 text-xs">{prompt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
           </ScrollView>
        ) : (
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
        )}

        <View className="p-4 bg-slate-950 border-t border-white/5">
            <View className="flex-row items-center bg-slate-900 rounded-full px-4 py-2 border border-white/10">
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask a question..."
                    placeholderTextColor="#64748b"
                    className="flex-1 text-white h-10 mr-2"
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity 
                    onPress={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`w-8 h-8 rounded-full items-center justify-center ${!input.trim() ? 'bg-slate-800' : 'bg-indigo-600'}`}
                >
                   {isLoading ? <ActivityIndicator size="small" color="white" /> : <Send size={14} color="white" />}
                </TouchableOpacity>
            </View>
        </View>
    </KeyboardAvoidingView>
  );
}
