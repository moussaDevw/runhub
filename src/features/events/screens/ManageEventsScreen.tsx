import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ManagedEventCard } from '@/components/ui/managed-event-card';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { useMyEvents } from '../hooks/useEvents';
import { formatEventPresentation } from '../utils/event.utils';

export function ManageEventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: myEvents = [] } = useMyEvents();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mes events créés</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/creer' as any)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {myEvents.map((event) => {
          const presentation = formatEventPresentation(event);
          return (
            <ManagedEventCard
              key={event.id}
              {...presentation}
              title={event.title}
              onModifierPress={() => router.push(`/(tabs)/creer?id=${event.id}` as any)}
              onCheckInPress={() => router.push(`/check-in/${event.id}` as any)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space16,
    paddingBottom: Spacing.space16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.space20,
    paddingBottom: 60,
  },
});
