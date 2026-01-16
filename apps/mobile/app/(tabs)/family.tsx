import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, UserPlus } from 'lucide-react-native';

import { useTabBar } from '../../src/context/TabBarContext';
import { useEffect, useState } from 'react';
import { InviteSheet } from '../../src/components/family/InviteSheet';
import { JoinSheet } from '../../src/components/family/JoinSheet';

export default function FamilyScreen() {
  const { fabActionTrigger } = useTabBar();
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showJoinSheet, setShowJoinSheet] = useState(false);

  useEffect(() => {
    if (fabActionTrigger > 0) {
      setShowInviteSheet(true);
    }
  }, [fabActionTrigger]);

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
          Family & Friends
        </Text>
        <Text className="text-slate-400 text-sm mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
          Share your context with loved ones
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="w-20 h-20 bg-slate-900 rounded-full items-center justify-center mb-6">
          <Users size={40} color="#94a3b8" />
        </View>
        <Text className="text-white font-bold text-xl mb-2 text-center" style={{ fontFamily: 'Inter_700Bold' }}>
          No Members Yet
        </Text>
        <Text className="text-slate-400 text-sm text-center max-w-xs leading-5 mb-8" style={{ fontFamily: 'Inter_400Regular' }}>
          Invite family and close friends to share specific context, life chapters, or emergency info.
        </Text>
        
        <TouchableOpacity 
          className="bg-primary-500 px-6 py-3 rounded-xl flex-row items-center mb-4"
          onPress={() => setShowInviteSheet(true)}
        >
          <UserPlus size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold" style={{ fontFamily: 'Inter_600SemiBold' }}>
            Invite Member
          </Text>
        </TouchableOpacity>

         <TouchableOpacity 
          className="bg-white/10 px-6 py-3 rounded-xl flex-row items-center"
          onPress={() => setShowJoinSheet(true)}
        >
          <Text className="text-white font-semibold" style={{ fontFamily: 'Inter_600SemiBold' }}>
            Join a Circle
          </Text>
        </TouchableOpacity>
      </View>

      <InviteSheet 
        isVisible={showInviteSheet} 
        onClose={() => setShowInviteSheet(false)} 
      />
      
      <JoinSheet 
        isVisible={showJoinSheet} 
        onClose={() => setShowJoinSheet(false)} 
      />
    </SafeAreaView>
  );
}
