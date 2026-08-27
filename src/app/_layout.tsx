import '@/core/i18n/i18n';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { queryClient } from '@/core/api/query-client';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { CreateBottomSheet } from '@/features/creation/components/CreateBottomSheet';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>

          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <CreateBottomSheet />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="index" />
              <Stack.Screen name="auth/login" />
            </Stack>
          </ThemeProvider>

      </AuthProvider>
    </QueryClientProvider>
  );
}

