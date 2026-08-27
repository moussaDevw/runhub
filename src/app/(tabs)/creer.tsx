import { View } from 'react-native';

// This screen is never shown — the "creer" tab is disabled in the layout.
// The "+" button opens the CreateBottomSheet modal (global, root layout).
// This file must exist for expo-router to register the route.
export default function CreerRoute() {
  return <View />;
}
