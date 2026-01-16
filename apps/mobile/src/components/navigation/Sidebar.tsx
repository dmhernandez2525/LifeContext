import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Home, 
  Mic, 
  Map, 
  BookOpen, 
  Settings, 
  Brain,
  Layout,
  Target,
  LineChart,
  HelpCircle,
  Users,
  LucideIcon
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (route: string) => {
      // Simple check, can be more robust
      if (route === '/(tabs)') return pathname === '/' || pathname === '/index';
      return pathname.includes(route);
  };

  const NavItem = ({ icon: Icon, label, route, color = "#94a3b8", activeColor = "#a855f7" }: { icon: LucideIcon, label: string, route: string, color?: string, activeColor?: string }) => {
    const active = isActive(route);
    return (
      <TouchableOpacity 
        onPress={() => router.push(route as never)}
        className={`flex-row items-center p-3 mb-2 rounded-xl transition-all ${active ? 'bg-slate-800' : 'hover:bg-slate-900/50'}`}
      >
        <Icon size={20} color={active ? activeColor : color} strokeWidth={active ? 2.5 : 2} />
        <Text 
            className={`ml-3 text-sm font-semibold ${active ? 'text-white' : 'text-slate-400'}`}
            style={{ fontFamily: active ? 'Inter_700Bold' : 'Inter_600SemiBold' }}
        >
            {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-64 bg-slate-950 border-r border-white/10 flex-1 pt-4 px-4" style={{ paddingTop: insets.top }}>
        {/* Logo Area */}
        <View className="flex-row items-center mb-8 px-2">
            <View className="w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center mr-3">
                <Text className="text-white font-bold text-lg">LC</Text>
            </View>
            <Text className="text-white font-bold text-xl tracking-tight">LifeContext</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 px-2">Main</Text>
            <NavItem icon={Home} label="Dashboard" route="/(tabs)" activeColor="#6366f1" />
            <NavItem icon={Mic} label="Record" route="/(tabs)/record" activeColor="#ef4444" />
            <NavItem icon={Map} label="Timeline" route="/(tabs)/timeline" activeColor="#10b981" />
            <NavItem icon={BookOpen} label="Journal" route="/(tabs)/journal" activeColor="#f59e0b" />

            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-6 mb-2 px-2">Tools</Text>
            <NavItem icon={Brain} label="Brain Dump" route="/(tabs)/braindump" activeColor="#d946ef" />
            <NavItem icon={Layout} label="Kanban" route="/(tabs)/kanban" activeColor="#3b82f6" />
            <NavItem icon={HelpCircle} label="Questions" route="/(tabs)/questions" activeColor="#8b5cf6" />
            <NavItem icon={LineChart} label="Insights" route="/(tabs)/insights" activeColor="#ec4899" />
            <NavItem icon={Target} label="Life Planning" route="/life-planning" activeColor="#14b8a6" />
            <NavItem icon={Users} label="Family" route="/family" activeColor="#f97316" />

            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-6 mb-2 px-2">System</Text>
            <NavItem icon={Settings} label="Settings" route="/(tabs)/settings" />
        </ScrollView>
        
        {/* User / Sync Status Mini */}
        <View className="py-4 border-t border-white/5">
            <View className="flex-row items-center px-2">
                <View className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center mr-3">
                    <Text className="text-white text-xs font-bold">ME</Text>
                </View>
                <View>
                    <Text className="text-white text-xs font-bold">My Context</Text>
                    <Text className="text-slate-500 text-[10px]">Sync: Offline</Text>
                </View>
            </View>
        </View>
    </View>
  );
}
