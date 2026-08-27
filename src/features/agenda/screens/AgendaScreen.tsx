import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { ManageEventsCard } from '@/components/ui/manage-events-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ClubEventRow } from '@/components/ui/club-event-row';
import { formatEventPresentation } from '@/features/events/utils/event.utils';
import { useAgendaScreen } from '../hooks/useAgendaScreen';

export function AgendaScreen() {
  const insets = useSafeAreaInsets();
  
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
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.light.ink3} />
        }
      >
        <Text style={styles.pageTitle}>{t('agenda.title')}</Text>

        <ManageEventsCard count={myEventsCount} onPress={handleNavigateManageEvents} />

        <SegmentedControl
          options={[t('agenda.upcoming'), t('agenda.past')]}
          selectedIndex={selectedTab}
          onChange={setSelectedTab}
        />

        {agendaEvents.length > 0 ? (
          <>
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
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.light.ink3} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyStateText}>
              {selectedTab === 0 ? t('agenda.noUpcoming') : t('agenda.noPast')}
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              activeOpacity={0.8}
              onPress={handleNavigateExplore}
            >
              <Text style={styles.exploreButtonText}>{t('agenda.exploreEvents')}</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
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
