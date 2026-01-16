import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, HardDrive, Database, ShieldCheck, FileText, ChevronLeft, LucideIcon } from 'lucide-react-native';

interface SettingsItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  color: string;
  onPress: () => void;
}

function SettingsItem({ icon: Icon, title, subtitle, color, onPress }: SettingsItemProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center p-4 border-b border-white/5 bg-slate-900/50 first:rounded-t-2xl last:rounded-b-2xl last:border-b-0"
    >
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-base" style={{ fontFamily: 'Inter_600SemiBold' }}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
            {subtitle}
          </Text>
        )}
      </View>
      <ChevronRight size={20} color="#64748b" />
    </TouchableOpacity>
  );
}

export default function SettingsIndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-white/5 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white" style={{ fontFamily: 'Inter_700Bold' }}>
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
          App Security
        </Text>
        <View className="mb-8">
            <SettingsItem 
                icon={ShieldCheck}
                title="Security & Privacy"
                subtitle="App lock, biometrics, auto-lock"
                color="#a855f7"
                onPress={() => router.push('/settings/security')}
            />
        </View>

        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
          Data & Storage
        </Text>
        <View className="mb-8">
            <SettingsItem 
                icon={HardDrive}
                title="Storage Management"
                subtitle="View usage, clear cache"
                color="#3b82f6"
                onPress={() => router.push('/settings/storage')}
            />
            <SettingsItem 
                icon={Database}
                title="Data Sovereignty"
                subtitle="Export, backups, emergency access"
                color="#10b981"
                onPress={() => router.push('/settings/data')} // We'll implement this next
            />
        </View>

        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">
          About
        </Text>
        <View className="mb-8">
            <SettingsItem 
                icon={FileText}
                title="About LifeContext"
                subtitle="Version 0.0.1 (Alpha)"
                color="#64748b"
                onPress={() => {}} 
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
