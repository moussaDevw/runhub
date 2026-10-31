import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPORT_OPTIONS, SportSelector } from '../components/SportSelector';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import { TrackerApiService } from '../services/tracker-api.service';
import { TrackerMetricsService } from '../services/tracker-metrics.service';
import { useTrackerStore } from '../stores/useTrackerStore';

import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth/context/AuthContext';

export function TrackerHomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { sport, setSport, resetTracking } = useTrackerStore();

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'RH';

  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.allSettled([
        TrackerApiService.getMyStats(),
        TrackerApiService.getMyActivities(20),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        const statsData = (statsRes.value as any)?.data ?? statsRes.value;
        setStats(statsData);
      }
      if (activitiesRes.status === 'fulfilled' && activitiesRes.value) {
        const val = activitiesRes.value as any;
        const acts = val?.activities ?? val?.data?.activities ?? (Array.isArray(val) ? val : []);
        setActivities(acts);
      }
    } catch (e) {
      console.warn('Could not load tracker home data:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleStartRun = () => {
    resetTracking();
    router.push('/tracker/live' as any);
  };

  const selectedSportMeta = SPORT_OPTIONS.find((s) => s.key === sport) || SPORT_OPTIONS[0];
  const dateLocale = i18n.language?.startsWith('en') ? 'en-US' : 'fr-FR';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/profil' as any)}
            accessibilityRole="button"
            accessibilityLabel={t('tracker.myProfile')}
            style={styles.avatarButton}
          >
            <Avatar initials={userInitials} size={36} backgroundColor={AccentColors.bissap} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{t('tracker.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('tracker.subtitle')}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStartRun}
          style={styles.quickStartPill}
          accessibilityRole="button"
          accessibilityLabel={t('tracker.launchLiveTracker')}
        >
          <Ionicons name="play" size={16} color="#ffffff" style={{ marginRight: 4 }} />
          <Text style={styles.quickStartPillText}>{t('tracker.go')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={AccentColors.bissap}
          />
        }
      >
        <View style={styles.responsiveContainer}>
          {/* Quick Launch Hero Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroCardBadge}>{t('tracker.newSessionBadge')}</Text>
            <Text style={styles.heroCardTitle}>{t('tracker.readyTitle')}</Text>
            <Text style={styles.heroCardDesc}>
              {t('tracker.readyDescription')}
            </Text>

            <View style={styles.sportSelectorContainer}>
              <SportSelector selectedSport={sport} onSelect={setSport} />
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleStartRun}
              style={[styles.startButton, { backgroundColor: selectedSportMeta.color }]}
            >
              <Ionicons name="play-circle" size={24} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.startButtonText}>
                {t(`tracker.startBySport.${selectedSportMeta.key}`, {
                  defaultValue: t('tracker.startSession', {
                    sport: t(`tracker.sports.${selectedSportMeta.key}`, {
                      defaultValue: selectedSportMeta.labelFr,
                    }).toLowerCase(),
                  }),
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Aggregate Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>{t('tracker.myStats')}</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statNumber}
                >
                  {stats?.weeklyDistanceKm ? Number(stats.weeklyDistanceKm).toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.statUnit}>{t('tracker.km')}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statLabel}>
                  {t('tracker.thisWeek')}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statNumber}
                >
                  {stats?.monthlyDistanceKm ? Number(stats.monthlyDistanceKm).toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.statUnit}>{t('tracker.km')}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statLabel}>
                  {t('tracker.thisMonth')}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.statNumber}
                >
                  {stats?.totalDistanceKm ? Number(stats.totalDistanceKm).toFixed(0) : '0'}
                </Text>
                <Text style={styles.statUnit}>{t('tracker.km')}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statLabel}>
                  {t('tracker.totalCumulative')}
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Activities Section */}
          <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>{t('tracker.recentActivities')}</Text>

          {isLoading ? (
            <ActivityIndicator
              color={AccentColors.bissap}
              style={{ paddingVertical: Spacing.space24 }}
            />
          ) : activities.length > 0 ? (
            <View style={styles.activitiesList}>
              {activities.map((item) => {
                const sportKey =
                  typeof item.sport === 'string'
                    ? item.sport
                    : item.sport?.slug || 'running';
                const sportMeta =
                  SPORT_OPTIONS.find((s) => s.key === sportKey) || SPORT_OPTIONS[0];
                const dateStr = item.startedAt
                  ? new Date(item.startedAt).toLocaleDateString(dateLocale, {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  : '';

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedActivity(item)}
                    style={styles.activityCard}
                  >
                    <View style={[styles.activityIconCircle, { backgroundColor: `${sportMeta.color}15` }]}>
                      <MaterialCommunityIcons
                        name={sportMeta.icon as any}
                        size={22}
                        color={sportMeta.color}
                      />
                    </View>

                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle} numberOfLines={1}>
                        {item.title || t(`tracker.sports.${sportMeta.key}`, { defaultValue: sportMeta.labelFr })}
                      </Text>
                      <Text style={styles.activityDate}>{dateStr}</Text>
                    </View>

                    <View style={styles.activityMetrics}>
                      <Text style={styles.activityDistance}>
                        {Number(item.distanceKm || (item.distanceMeters ? item.distanceMeters / 1000 : 0)).toFixed(2)}{' '}
                        <Text style={styles.kmSmall}>{t('tracker.km')}</Text>
                      </Text>
                      <Text style={styles.activitySubMetrics}>
                        {item.durationSeconds
                          ? TrackerMetricsService.formatDuration(item.durationSeconds)
                          : '--:--'}{' '}
                        · {item.avgPaceSecPerKm ? TrackerMetricsService.formatPace(item.avgPaceSecPerKm) : ''}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={Colors.light.ink3}
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons
                name="run-fast"
                size={40}
                color={Colors.light.ink3}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.emptyTitle}>{t('tracker.emptyTitle')}</Text>
              <Text style={styles.emptySubtitle}>
                {t('tracker.emptySubtitle')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleStartRun}
                style={styles.emptyButton}
              >
                <Text style={styles.emptyButtonText}>{t('tracker.startFirstSession')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        </View>
      </ScrollView>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        visible={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf9f5', // Ivoire light background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0ed',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarButton: {
    marginRight: 2,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 24,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  quickStartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AccentColors.bissap,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  quickStartPillText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.space16,
    gap: Spacing.space16,
  },
  responsiveContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    gap: Spacing.space16,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.space20,
    borderWidth: 1,
    borderColor: '#ecece9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroCardBadge: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    letterSpacing: 1.5,
    color: AccentColors.bissap,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroCardTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
  },
  heroCardDesc: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  sportSelectorContainer: {
    marginTop: Spacing.space12,
    marginBottom: Spacing.space16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  startButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: Spacing.space16,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  sectionTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: Spacing.space12,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 24,
    lineHeight: 28,
    color: Colors.light.text,
  },
  statUnit: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    marginTop: -2,
  },
  statLabel: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#f0f0ed',
  },
  recentSection: {
    marginTop: Spacing.space4,
  },
  activitiesList: {
    gap: Spacing.space8,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.space12,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  activityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  activityDate: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  activityMetrics: {
    alignItems: 'flex-end',
  },
  activityDistance: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
  },
  kmSmall: {
    fontSize: 11,
    fontFamily: Typography.corps.fontFamily,
    color: Colors.light.ink3,
  },
  activitySubMetrics: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: Spacing.space24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  emptyTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.space16,
  },
  emptyButton: {
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: AccentColors.bissap,
  },
});
