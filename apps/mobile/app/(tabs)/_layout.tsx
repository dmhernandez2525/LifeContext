import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../src/components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#f8fafc',
        headerShadowVisible: false,
        headerTransparent: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar since we use custom
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timeline',
          headerTitle: 'Life Timeline',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          headerTitle: 'Journal',
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          headerTitle: 'Record',
        }}
      />
      <Tabs.Screen
        name="kanban"
        options={{
          title: 'Kanban',
          headerTitle: 'Life Planning',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
        }}
      />
      {/* Hide insights tab - keeping file for backward compatibility */}
      <Tabs.Screen
        name="insights"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}
