/**
 * Questions Stack Layout
 */
import { Stack } from 'expo-router';

export default function QuestionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen
        name="[slug]"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
