import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Typography, AccentColors } from '@/constants/theme';
import { useHealthData } from '../hooks/useHealthData';

interface FitnessStatsCardProps {
  onPressConnect?: () => void;
}

export function FitnessStatsCard({ onPressConnect }: FitnessStatsCardProps) {
  const { t } = useTranslation();
  const { data, isLoading, provider } = useHealthData();

  const providerName = provider === 'apple_health' ? t('health.appleHealth') : t('health.healthConnect');
  const providerIcon = provider === 'apple_health' ? 'heart-circle' : 'fitness';

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color={AccentColors.bissap} />
      </View>
    );
  }

  if (!data?.isConnected) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Ionicons name={providerIcon} size={24} color="#e04848" />
          </View>
          <View style={styles.headerTexts}>
            <Text style={styles.cardTitle}>{t('health.syncKilometers')}</Text>
            <Text style={styles.cardSubtitle}>
              {t('health.connectSubtitle', { provider: providerName })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.connectButton}
          onPress={onPressConnect}
          accessibilityRole="button"
        >
          <Ionicons name="link-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.connectButtonText}>
            {t('health.connectButton', { provider: providerName })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircleActive}>
          <Ionicons name="checkmark-circle" size={20} color="#22a06b" />
        </View>
        <View style={styles.headerTexts}>
          <Text style={styles.cardTitle}>{t('health.runningStats')}</Text>
          <Text style={styles.cardSubtitle}>
            {t('health.syncedWith', { provider: providerName })}
          </Text>
        </View>
        <Ionicons name={providerIcon} size={22} color="#e04848" />
      </View>

      {/* Metrics Row */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{data.weeklyDistanceKm.toFixed(1)}</Text>
          <Text style={styles.statUnit}>{t('health.km')}</Text>
          <Text style={styles.statLabel}>{t('health.thisWeek')}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{data.monthlyDistanceKm.toFixed(1)}</Text>
          <Text style={styles.statUnit}>{t('health.km')}</Text>
          <Text style={styles.statLabel}>{t('health.thisMonth')}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{data.todaySteps.toLocaleString()}</Text>
          <Text style={styles.statUnit}>{t('health.steps')}</Text>
          <Text style={styles.statLabel}>{t('health.today')}</Text>
        </View>
      </View>

      {/* Workouts snippet */}
      {data.recentWorkouts && data.recentWorkouts.length > 0 && (
        <View style={styles.recentRunContainer}>
          <Ionicons name="walk-outline" size={16} color={Colors.light.ink3} />
          <Text style={styles.recentRunText}>
            {t('health.lastRun', {
              distance: data.recentWorkouts[0].distanceKm,
              duration: data.recentWorkouts[0].durationMinutes,
              pace: data.recentWorkouts[0].averagePace || '5:08 /km',
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: Spacing.space16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: Spacing.space16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fee4e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space12,
  },
  iconCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space12,
  },
  headerTexts: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  cardSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: Colors.light.text,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.space8,
  },
  connectButtonText: {
    color: '#ffffff',
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 12,
    paddingVertical: Spacing.space12,
    paddingHorizontal: Spacing.space8,
    marginTop: Spacing.space8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
    lineHeight: 24,
  },
  statUnit: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 11,
    color: AccentColors.bissap,
    marginTop: -2,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e3e3e1',
  },
  recentRunContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.space12,
    paddingTop: Spacing.space8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 6,
  },
  recentRunText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
