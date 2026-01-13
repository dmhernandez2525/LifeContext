import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Shield, Lock, Cloud, Server, Check, X, AlertTriangle } from 'lucide-react-native';
import { Card } from '../src/components/ui';

const COMPARISON_DATA = [
  { feature: 'Data Storage', local: 'Your device only', cloud: 'Their servers' },
  { feature: 'Encryption', local: 'AES-256-GCM locally', cloud: 'Transit + At-Rest' },
  { feature: 'Access Control', local: 'You have the keys', cloud: 'Provider can access' },
  { feature: 'Data Portability', local: 'Full JSON export', cloud: 'Limited or locked' },
  { feature: 'Offline Access', local: 'Always available', cloud: 'Requires connection' },
  { feature: 'Deletion', local: 'Instant & permanent', cloud: 'May persist in backups' },
];

export default function DataSovereigntyScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Data Sovereignty',
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ChevronLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView className="flex-1 bg-slate-950" edges={['bottom']}>
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-indigo-600/20 rounded-full items-center justify-center mb-4">
              <Shield size={40} color="#818cf8" />
            </View>
            <Text className="text-2xl font-bold text-white text-center mb-2" style={{ fontFamily: 'Inter_700Bold' }}>
              Trust No One
            </Text>
            <Text className="text-slate-400 text-center text-sm leading-6" style={{ fontFamily: 'Inter_400Regular' }}>
              Your life context is too valuable to trust to any third party. LifeContext gives you complete control over your most personal data.
            </Text>
          </View>

          {/* Key Principles */}
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1" style={{ fontFamily: 'Inter_700Bold' }}>
            Core Principles
          </Text>
          
          <Card variant="glass" className="mb-4 border-indigo-500/20">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-indigo-500/20 rounded-full items-center justify-center mr-4">
                <Lock size={20} color="#818cf8" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
                  Local-First Storage
                </Text>
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  All data is stored encrypted on your device. Nothing is sent to our servers.
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="glass" className="mb-4 border-green-500/20">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-green-500/20 rounded-full items-center justify-center mr-4">
                <Server size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
                  You Own the Keys
                </Text>
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  Encryption keys never leave your device. Not even we can access your data.
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="glass" className="mb-6 border-amber-500/20">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-amber-500/20 rounded-full items-center justify-center mr-4">
                <Cloud size={20} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold mb-1" style={{ fontFamily: 'Inter_700Bold' }}>
                  Optional Sync
                </Text>
                <Text className="text-slate-400 text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  If you choose to sync, encrypted blobs go to YOUR cloud provider—not ours.
                </Text>
              </View>
            </View>
          </Card>

          {/* Comparison Table */}
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1" style={{ fontFamily: 'Inter_700Bold' }}>
            LifeContext vs Traditional Apps
          </Text>

          <Card variant="glass" className="mb-8 p-0 overflow-hidden border-white/5">
            {/* Header Row */}
            <View className="flex-row bg-slate-800/50 p-3">
              <Text className="flex-1 text-slate-400 font-bold text-xs uppercase" style={{ fontFamily: 'Inter_700Bold' }}>
                Feature
              </Text>
              <Text className="w-24 text-green-400 font-bold text-xs uppercase text-center" style={{ fontFamily: 'Inter_700Bold' }}>
                LifeContext
              </Text>
              <Text className="w-24 text-red-400 font-bold text-xs uppercase text-center" style={{ fontFamily: 'Inter_700Bold' }}>
                Cloud Apps
              </Text>
            </View>
            
            {COMPARISON_DATA.map((row, index) => (
              <View 
                key={row.feature}
                className={`flex-row p-3 ${index % 2 === 0 ? 'bg-slate-900/30' : ''}`}
              >
                <Text className="flex-1 text-white text-sm" style={{ fontFamily: 'Inter_400Regular' }}>
                  {row.feature}
                </Text>
                <View className="w-24 items-center">
                  <View className="flex-row items-center">
                    <Check size={12} color="#10b981" />
                    <Text className="text-slate-300 text-[10px] ml-1" numberOfLines={2}>
                      {row.local}
                    </Text>
                  </View>
                </View>
                <View className="w-24 items-center">
                  <View className="flex-row items-center">
                    <AlertTriangle size={12} color="#f59e0b" />
                    <Text className="text-slate-400 text-[10px] ml-1" numberOfLines={2}>
                      {row.cloud}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>

          {/* Emergency Access CTA */}
          <TouchableOpacity 
            onPress={() => router.push('/settings/data')}
            className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-4 mb-20"
          >
            <Text className="text-indigo-300 font-bold text-center" style={{ fontFamily: 'Inter_700Bold' }}>
              Set Up Emergency Access →
            </Text>
            <Text className="text-indigo-400/70 text-xs text-center mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
              Use Shamir's Secret Sharing to protect your legacy
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
