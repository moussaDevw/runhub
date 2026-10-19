import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ManagedEventCard, ManagedEventCardSkeleton } from '@/features/events/components';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { HStack, Screen } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { useMyEvents } from '../hooks/useEvents';
import { formatEventPresentation } from '../utils/event.utils';

export function ManageEventsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const { data: myEvents = [], isLoading } = useMyEvents();

  const header = (
    <HStack align="center" justify="space-between" style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.back', { defaultValue: 'Retour' })}
      >
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: theme.text }]}>{t('manageEvents.title')}</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/event/create' as any)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('common.add', { defaultValue: 'Ajouter' })}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </HStack>
  );

  return (
    <Screen
      safeTop
      safeBottom
      scrollable
      header={header}
      backgroundColor={theme.backgroundElement}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading ? (
        <>
          <ManagedEventCardSkeleton />
          <ManagedEventCardSkeleton />
        </>
      ) : (
        myEvents.map((event) => {
          const presentation = formatEventPresentation(event);
          return (
            <ManagedEventCard
              key={event.id}
              {...presentation}
              title={event.title}
              onModifierPress={() => router.push(`/event/create?id=${event.id}` as any)}
              onCheckInPress={() => router.push(`/check-in/${event.id}` as any)}
            />
          );
        })
      )}
    </Screen>
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
