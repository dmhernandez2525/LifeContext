import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useFamilyStore } from '../src/store/useFamilyStore';
import { MemberCard, SharedFeedItem } from '../src/components/family/FamilyComponents';
import { InviteSheet } from '../src/components/family/InviteSheet';
import { Users, Plus, ChevronLeft, MoreHorizontal, Sparkles } from 'lucide-react-native';

export default function FamilyScreen() {
  const router = useRouter();
  const { members, sharedFeed, seedDemoFamily } = useFamilyStore();
  const [showInviteSheet, setShowInviteSheet] = useState(false);

  // Auto-seed for demo purposes if empty
  useEffect(() => {
    if (members.length === 0 && sharedFeed.length === 0) {
      // seedDemoFamily(); // Uncomment to auto-seed
    }
  }, []);

  const handleInvite = () => {
    setShowInviteSheet(true);
  };

  const renderHeader = () => (
    <View className="pt-2 pb-6 px-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"
        >
          <ChevronLeft size={24} color="#71717a" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          Family Circle
        </Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"
        >
          <MoreHorizontal size={20} color="#71717a" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            My Family
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleInvite}
          className="flex-row items-center bg-indigo-600 px-4 py-2 rounded-full shadow-sm shadow-indigo-200 dark:shadow-none"
        >
          <Plus size={16} color="white" className="mr-1" />
          <Text className="font-semibold text-white">Invite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListHeader = () => (
    <View className="mb-6">
      {/* Members Section */}
      <View className="px-4 mt-6">
        {members.length === 0 ? (
          <View className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl items-center border border-indigo-100 dark:border-indigo-900/30 border-dashed">
            <View className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full items-center justify-center mb-3">
              <Users size={24} color="#6366f1" />
            </View>
            <Text className="text-base font-bold text-indigo-900 dark:text-indigo-100 mb-1">
              Start your circle
            </Text>
            <Text className="text-sm text-indigo-700 dark:text-indigo-300 text-center mb-4">
              Invite your partner or close family to share journals and life chapters securely.
            </Text>
             <TouchableOpacity 
              onPress={seedDemoFamily} // For demo
              className="flex-row items-center space-x-2 bg-indigo-200 dark:bg-indigo-800 px-3 py-1.5 rounded-lg"
            >
              <Sparkles size={12} color="#4338ca" />
              <Text className="text-xs font-semibold text-indigo-800 dark:text-indigo-200">
                Tap to View Demo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {members.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </View>
        )}
      </View>

      {/* Feed Title */}
      <View className="px-4 mt-8 mb-2 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          Shared Timeline
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black pt-10">
      <Stack.Screen options={{ headerShown: false }} />
      
      {renderHeader()}

      <FlashList
        data={sharedFeed}
        renderItem={({ item }) => (
          <View className="px-4">
            <SharedFeedItem item={item} />
          </View>
        )}
        estimatedItemSize={200}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={() => (
          <View className="items-center py-10 opacity-50">
            <Text className="text-gray-400 dark:text-gray-600 text-center">
              No shared updates yet.
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <InviteSheet 
        isVisible={showInviteSheet} 
        onClose={() => setShowInviteSheet(false)} 
      />
    </SafeAreaView>
  );
}
