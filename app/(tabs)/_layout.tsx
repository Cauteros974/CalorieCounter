// Добавьте этот импорт в самый верх app/_layout.tsx, если его там нет:
import { Colors } from '@/constants/Colors'; // Или где у вас лежат цвета
import { useUserStore } from '@/store/useUserStore';
import { Stack } from 'expo-router';

function RootLayoutNav() {
  // Перенесли строки 21-22 из старого App сюда:
  const { theme } = useUserStore();
  const currentColors = Colors[theme || 'light']; 

  return (
    // Ваша текущая разметка стека
    <Stack screenOptions={{ contentStyle: { backgroundColor: currentColors?.background || '#FFF' } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="weight" options={{ headerShown: false }} />
      <Stack.Screen name="achievements" options={{ headerShown: false }} />
      <Stack.Screen name="reminders" options={{ headerShown: false }} />
      <Stack.Screen name="album" options={{ headerShown: false }} />
    </Stack>
  );
}
