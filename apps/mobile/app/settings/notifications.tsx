import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Flame, Sparkles, Calendar, Clock, Moon } from 'lucide-react-native';
import { SafeHaptics as Haptics } from '../../src/lib/haptics';
import { Card } from '../../src/components/ui';
import {
  useNotifications,
  getPreferences,
} from '../../src/notifications';
import type { NotificationPreferences } from '../../src/notifications';

const timeOptions = [
  '06:00', '07:00', '08:00', '09:00', '10:00',
  '12:00', '14:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00',
];

const inactivityOptions = [1, 2, 3, 5, 7];

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const { updatePreferences, requestPermission, hasPermission } = useNotifications();
  const [prefs, setPrefs] = useState<NotificationPreferences>(getPreferences());
  const [showTimeSelector, setShowTimeSelector] = useState(false);

  useEffect(() => {
    setPrefs(getPreferences());
  }, []);

  const toggle = useCallback(
    async (key: keyof NotificationPreferences, value: boolean) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (key === 'enabled' && value && !hasPermission) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      const updated = { ...prefs, [key]: value };
      setPrefs(updated);
      await updatePreferences({ [key]: value });
    },
    [prefs, hasPermission, requestPermission, updatePreferences],
  );

  const setReminderTime = useCallback(
    async (time: string) => {
      const updated = { ...prefs, journalReminderTime: time };
      setPrefs(updated);
      setShowTimeSelector(false);
      await updatePreferences({ journalReminderTime: time });
    },
    [prefs, updatePreferences],
  );

  const setInactivityDays = useCallback(
    async (days: number) => {
      const updated = { ...prefs, inactivityDays: days };
      setPrefs(updated);
      await updatePreferences({ inactivityDays: days });
    },
    [prefs, updatePreferences],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <View className="px-6 py-4 border-b border-white/5 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          className="text-xl font-bold text-white"
          style={{ fontFamily: 'Inter_700Bold' }}
        >
          Notifications
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <ToggleRow
          icon={Bell}
          color="#f59e0b"
          title="Enable Notifications"
          subtitle="Receive reminders and alerts"
          value={prefs.enabled}
          onToggle={(v) => toggle('enabled', v)}
        />

        {prefs.enabled && (
          <>
            <SectionLabel text="Reminders" />
            <ToggleRow
              icon={Calendar}
              color="#3b82f6"
              title="Daily Journal Reminder"
              subtitle={`Remind at ${formatTime(prefs.journalReminderTime)}`}
              value={prefs.journalReminder}
              onToggle={(v) => toggle('journalReminder', v)}
            />
            {prefs.journalReminder && (
              <View className="mb-4">
                <TouchableOpacity
                  onPress={() => setShowTimeSelector(!showTimeSelector)}
                  className="ml-14 mb-2"
                >
                  <Text className="text-blue-400 text-sm" style={{ fontFamily: 'Inter_600SemiBold' }}>
                    {showTimeSelector ? 'Hide times' : 'Change time'}
                  </Text>
                </TouchableOpacity>
                {showTimeSelector && (
                  <View className="flex-row flex-wrap ml-14 gap-2">
                    {timeOptions.map((t) => (
                      <TouchableOpacity
                        key={t}
                        onPress={() => setReminderTime(t)}
                        className={`px-3 py-1.5 rounded-full ${t === prefs.journalReminderTime ? 'bg-blue-500' : 'bg-slate-800'}`}
                      >
                        <Text className={`text-xs ${t === prefs.journalReminderTime ? 'text-white font-bold' : 'text-slate-300'}`}>
                          {formatTime(t)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            <ToggleRow
              icon={Flame}
              color="#f97316"
              title="Streak Alerts"
              subtitle="Remind before your streak breaks"
              value={prefs.streakAlerts}
              onToggle={(v) => toggle('streakAlerts', v)}
            />

            <SectionLabel text="Insights" />
            <ToggleRow
              icon={Sparkles}
              color="#8b5cf6"
              title="Insight Notifications"
              subtitle="When new patterns are found"
              value={prefs.insightNotifications}
              onToggle={(v) => toggle('insightNotifications', v)}
            />
            <ToggleRow
              icon={Calendar}
              color="#10b981"
              title="Weekly Summary"
              subtitle="Every Monday at 9:00 AM"
              value={prefs.weeklySummary}
              onToggle={(v) => toggle('weeklySummary', v)}
            />

            <SectionLabel text="Re-engagement" />
            <ToggleRow
              icon={Clock}
              color="#ec4899"
              title="Inactivity Nudge"
              subtitle={`After ${prefs.inactivityDays} days of inactivity`}
              value={prefs.inactivityNudge}
              onToggle={(v) => toggle('inactivityNudge', v)}
            />
            {prefs.inactivityNudge && (
              <View className="flex-row ml-14 gap-2 mb-4">
                {inactivityOptions.map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setInactivityDays(d)}
                    className={`px-3 py-1.5 rounded-full ${d === prefs.inactivityDays ? 'bg-pink-500' : 'bg-slate-800'}`}
                  >
                    <Text className={`text-xs ${d === prefs.inactivityDays ? 'text-white font-bold' : 'text-slate-300'}`}>
                      {d}d
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <SectionLabel text="Quiet Hours" />
            <ToggleRow
              icon={Moon}
              color="#64748b"
              title="Quiet Hours"
              subtitle={prefs.quietHoursEnabled
                ? `${formatTime(prefs.quietHoursStart)} to ${formatTime(prefs.quietHoursEnd)}`
                : 'Mute notifications during set hours'
              }
              value={prefs.quietHoursEnabled}
              onToggle={(v) => toggle('quietHoursEnabled', v)}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 mt-6 ml-1">
      {text}
    </Text>
  );
}

function ToggleRow({
  icon: Icon,
  color,
  title,
  subtitle,
  value,
  onToggle,
}: {
  icon: typeof Bell;
  color: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <Card variant="glass" className="border-white/5 mb-3">
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text
            className="text-white font-semibold text-sm"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            {title}
          </Text>
          <Text
            className="text-slate-400 text-xs mt-0.5"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            {subtitle}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#334155', true: '#3b82f6' }}
          thumbColor="#ffffff"
        />
      </View>
    </Card>
  );
}
