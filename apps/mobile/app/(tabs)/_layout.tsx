import { Tabs } from 'expo-router';
import { RocketTabBar } from '../../src/components/navigation';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <RocketTabBar {...props} />}
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
      {/* Primary tabs - shown in RocketTabBar */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Your Life Context',
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          headerTitle: 'Life Timeline',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          headerTitle: 'Daily Context',
        }}
      />
      
      {/* Secondary tabs - accessed via More menu */}
      <Tabs.Screen
        name="braindump"
        options={{
          title: 'Dump',
          headerTitle: 'Brain Dump',
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          headerTitle: 'Record Context',
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="kanban"
        options={{
          title: 'Planning',
          headerTitle: 'Action Items',
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Configuration',
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="questions"
        options={{
          title: 'Questions',
          headerTitle: 'Life Questions',
          href: null, // Hide from tab bar - accessed via More menu
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          headerTitle: 'AI Insights',
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
