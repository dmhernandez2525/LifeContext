import { Tabs } from 'expo-router';
import { RocketTabBar } from '../../src/components/navigation';
import { Sidebar } from '../../src/components/navigation/Sidebar';
import { View, useWindowDimensions, Platform } from 'react-native';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#020617' }}> 
      {/* Tablet Sidebar */}
      {isTablet && <Sidebar />}

      {/* Main Content (Tabs Navigator) */}
      <View style={{ flex: 1 }}>
        <Tabs
          tabBar={(props) => isTablet ? null : <RocketTabBar {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0f172a',
            },
            headerTintColor: '#f8fafc',
            headerShadowVisible: false,
            headerTransparent: false,
            headerShown: !isTablet, // Hide header on tablet - sidebar provides context
            tabBarStyle: { display: 'none' }, // Always hide default, we use custom or sidebar
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
      </View>
    </View>
  );
}
