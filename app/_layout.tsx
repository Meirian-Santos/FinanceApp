import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Finance App' }} />
      <Stack.Screen name="add-transaction" options={{ title: 'Add Transaction' }} />
    </Stack>
  );
}