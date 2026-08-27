if (__DEV__) {
  require("../../ReactotronConfig");
}
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { WelcomeScreen } from '@/features/auth/screens/WelcomeScreen';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function IndexRoute() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // If user has an active session, redirect to the explorer tab
  if (session) {
    return <Redirect href="/(tabs)/explorer" />;
  }

  // Otherwise, render the welcome onboarding screen of the app
  return <WelcomeScreen />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf6f0', // Creme background from theme
  },
});

