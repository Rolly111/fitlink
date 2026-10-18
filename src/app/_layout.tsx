import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AppProvider } from '@/context/AppContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="coach/[id]" options={{ title: '教练主页' }} />
          <Stack.Screen name="ask" options={{ title: '发起提问' }} />
          <Stack.Screen name="goals" options={{ title: '目标设置' }} />
          <Stack.Screen name="notifications" options={{ title: '通知' }} />
          <Stack.Screen name="coach-apply" options={{ title: '教练入驻' }} />
          <Stack.Screen name="conversation/[id]" options={{ title: '对话' }} />
          <Stack.Screen name="chats" options={{ title: '消息' }} />
        </Stack>
      </AppProvider>
    </ThemeProvider>
  );
}
