import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="security" />
      <Stack.Screen name="storage" />
      <Stack.Screen name="data" />
    </Stack>
  );
}
