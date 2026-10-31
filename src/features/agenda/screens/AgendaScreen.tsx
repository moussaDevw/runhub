import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HStack, Screen, Spacer, VStack } from '@/components/layout';
import { useTheme } from '@/hooks/use-theme';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { ManageEventsCard } from '@/features/events/components';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ClubEventRow } from '@/features/clubs/components';
import { formatEventPresentation } from '@/features/events/utils/event.utils';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'expo-router';
import { useAgendaScreen } from '../hooks/useAgendaScreen';

export function AgendaScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'RH';
  
  const {
    t,
    selectedTab,
    setSelectedTab,
    myEventsCount,
    agendaEvents,
    groupedAgendaEvents,
    isRefreshing,
    onRefresh,
    handleNavigateManageEvents,
    handleNavigateExplore,
    handleNavigateEventDetail,
  } = useAgendaScreen();

  return (
    <Screen
      safeTop
      safeBottom={false}
      scrollable
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
    >
      <HStack align="center" justify="space-between" style={{ marginBottom: Spacing.space12 }}>
        <Text style={[styles.pageTitle, { color: theme.text, marginBottom: 0 }]}>{t('agenda.title')}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/profil' as any)}
          accessibilityRole="button"
          accessibilityLabel="Mon profil"
        >
          <Avatar initials={userInitials} size={36} backgroundColor={AccentColors.bissap} />
        </TouchableOpacity>
      </HStack>

      <ManageEventsCard count={myEventsCount} onPress={handleNavigateManageEvents} />
      <Spacer size="space16" />

      <SegmentedControl
        options={[t('agenda.upcoming'), t('agenda.past')]}
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
      />

      {agendaEvents.length > 0 ? (
        <VStack gap="space16" style={{ marginTop: Spacing.space16 }}>
          {groupedAgendaEvents.map((group, gIdx) => (
            <View key={gIdx}>
              <Text style={styles.sectionTitle}>
                {selectedTab === 0 ? t(group.titleKey) : group.titleKey}
              </Text>
              {group.events.map((registration) => {
                const presentation = formatEventPresentation(registration.event);
                return (
                  <ClubEventRow
                    key={registration.id}
                    dateDay={presentation.dateDay}
                    dateTime={presentation.dateTime}
                    title={registration.event.title}
                    location={presentation.location}
                    imageSource={presentation.imageSource}
                    onPress={() => handleNavigateEventDetail(registration.event.id)}
                  />
                );
              })}
            </View>
          ))}
        </VStack>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color={theme.ink3} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
            {selectedTab === 0 ? t('agenda.noUpcoming') : t('agenda.noPast')}
          </Text>
          <TouchableOpacity 
            style={[styles.exploreButton, { backgroundColor: theme.cardBackground, borderColor: theme.line }]}
            activeOpacity={0.8}
            onPress={handleNavigateExplore}
            accessibilityRole="button"
          >
            <Text style={[styles.exploreButtonText, { color: theme.text }]}>{t('agenda.exploreEvents')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4',
  },
  scrollContent: {
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space12,
  },
  pageTitle: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: Spacing.space24,
  },
  sectionTitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.space12,
    marginLeft: 4,
    marginTop: Spacing.space16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.space32,
    marginTop: Spacing.space24,
  },
  emptyStateText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  exploreButton: {
    marginTop: Spacing.space16,
    paddingHorizontal: Spacing.space20,
    paddingVertical: Spacing.space12,
    backgroundColor: '#ffffff',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  exploreButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
});
