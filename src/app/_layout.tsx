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
  const { isAuthenticated, isLoading } = useAuth();
  usePushNotifications({ isAuthenticated });

  // Pendant le bootstrap, on ne sait pas encore si une session existe :
  // index.tsx affiche le loader, on évite de basculer les guards trop tôt.
  const isLoggedIn = !isLoading && isAuthenticated;

  return (
    <ThemeProvider value={DefaultTheme}>
      <AnimatedSplashOverlay />
      <CreateBottomSheet />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Point d'entrée : loader / WelcomeScreen / redirection vers les tabs */}
        <Stack.Screen name="index" />

        {/* Écrans publics : inaccessibles une fois connecté */}
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="auth/login" />
        </Stack.Protected>

        {/* Écrans privés : démontés automatiquement à la déconnexion */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profil" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="sports" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="favorites" />
          <Stack.Screen name="manage-events" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="apercu" />
          <Stack.Screen name="scan" />
          <Stack.Screen name="success" />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="check-in/[id]" />
          <Stack.Screen name="club/create" />
          <Stack.Screen name="club/[id]/index" />
          <Stack.Screen name="club/[id]/requests" />
          <Stack.Screen name="event/create" />
          <Stack.Screen name="event/[id]" />
          <Stack.Screen name="ticket/[id]" />
          <Stack.Screen name="tracker/live" />
          <Stack.Screen name="tracker/summary" />
        </Stack.Protected>
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

