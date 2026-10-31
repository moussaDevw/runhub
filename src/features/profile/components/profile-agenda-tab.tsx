import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacer, VStack } from '@/components/layout';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAgendaScreen } from '@/features/agenda/hooks/useAgendaScreen';
import { ClubEventRow } from '@/features/clubs/components';
import { ManageEventsCard } from '@/features/events/components';
import { formatEventPresentation } from '@/features/events/utils/event.utils';
import { useTheme } from '@/hooks/use-theme';

export function ProfileAgendaTab() {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    selectedTab,
    setSelectedTab,
    myEventsCount,
    agendaEvents,
    groupedAgendaEvents,
    handleNavigateManageEvents,
    handleNavigateExplore,
    handleNavigateEventDetail,
  } = useAgendaScreen();

  return (
    <View style={styles.container}>
      <ManageEventsCard count={myEventsCount} onPress={handleNavigateManageEvents} />

      <Spacer size="space16" />

      <SegmentedControl
        options={[t('agenda.upcoming', { defaultValue: 'À venir' }), t('agenda.past', { defaultValue: 'Passés' })]}
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
            <Text style={[styles.exploreButtonText, { color: theme.text }]}>
              {t('agenda.exploreEvents')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.space16,
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
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 15,
    color: Colors.light.ink3,
    textAlign: 'center',
    marginBottom: 20,
  },
  exploreButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e3e3e1',
    backgroundColor: '#ffffff',
  },
  exploreButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
});
