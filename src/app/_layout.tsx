import '@/core/i18n/i18n';
import { useEffect } from 'react';
import { DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { HankenGrotesk_400Regular, HankenGrotesk_700Bold } from '@expo-google-fonts/hanken-grotesk';
import { GeistMono_500Medium } from '@expo-google-fonts/geist-mono';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { queryClient } from '@/core/api/query-client';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { CreateBottomSheet } from '@/features/creation/components/CreateBottomSheet';
import { usePushNotifications } from '@/features/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error in web or reloads */
});

function RootNavigation() {
  const { isAuthenticated } = useAuth();
  usePushNotifications({ isAuthenticated });

  return (
    <ThemeProvider value={DefaultTheme}>
      <AnimatedSplashOverlay />
      <CreateBottomSheet />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_700Bold,
    HankenGrotesk_400Regular,
    HankenGrotesk_700Bold,
    GeistMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </QueryClientProvider>
  );
}

