import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { TrackerMetricsService } from '../services/tracker-metrics.service';

interface TrackerHUDProps {
  elapsedSeconds: number;
  distanceKm: number;
  avgPaceSecPerKm: number | null;
  caloriesBurned: number;
  elevationGainMeters: number;
}

export function TrackerHUD({
  elapsedSeconds,
  distanceKm,
  avgPaceSecPerKm,
  caloriesBurned,
  elevationGainMeters,
}: TrackerHUDProps) {
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const isCompact = height < 720 || width < 375;

  const formattedTime = TrackerMetricsService.formatDuration(elapsedSeconds);
  const formattedPace = TrackerMetricsService.formatPace(avgPaceSecPerKm);

  return (
    <View style={[styles.hudCard, isCompact && styles.hudCardCompact]}>
      {/* Primary Metric: Distance */}
      <View style={styles.primaryMetricContainer}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          allowFontScaling={false}
          style={[styles.primaryValue, isCompact && styles.primaryValueCompact]}
        >
          {distanceKm.toFixed(2)}
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.primaryUnit, isCompact && { fontSize: 10, letterSpacing: 1.5 }]}
        >
          {t('tracker.hud.kilometers')}
        </Text>
      </View>

      <View style={[styles.divider, isCompact && { marginVertical: Spacing.space8 }]} />

      {/* Secondary Metrics Row */}
      <View style={styles.metricsRow}>
        {/* Chrono */}
        <View style={styles.metricBlock}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            allowFontScaling={false}
            style={[styles.metricValue, isCompact && styles.metricValueCompact]}
          >
            {formattedTime}
          </Text>
          <Text allowFontScaling={false} style={styles.metricLabel}>
            {t('tracker.hud.time')}
          </Text>
        </View>

        <View style={[styles.verticalDivider, isCompact && { height: 24 }]} />

        {/* Allure */}
        <View style={styles.metricBlock}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            allowFontScaling={false}
            style={[styles.metricValue, isCompact && styles.metricValueCompact]}
          >
            {formattedPace}
          </Text>
          <Text allowFontScaling={false} style={styles.metricLabel}>
            {t('tracker.hud.avgPace')}
          </Text>
        </View>

        <View style={[styles.verticalDivider, isCompact && { height: 24 }]} />

        {/* Calories */}
        <View style={styles.metricBlock}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            allowFontScaling={false}
            style={[styles.metricValue, isCompact && styles.metricValueCompact]}
          >
            {caloriesBurned}
          </Text>
          <Text allowFontScaling={false} style={styles.metricLabel}>
            {t('tracker.hud.calories')}
          </Text>
        </View>
      </View>

      {/* Dénivelé optionnel si > 0 */}
      {elevationGainMeters > 0 && (
        <View style={[styles.elevationBadge, isCompact && { marginTop: Spacing.space4 }]}>
          <Text style={styles.elevationText}>
            {t('tracker.hud.elevationGain', { meters: Math.round(elevationGainMeters) })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hudCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: Spacing.space16,
    paddingHorizontal: Spacing.space20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  primaryMetricContainer: {
    alignItems: 'center',
    paddingVertical: 4,
    width: '100%',
  },
  primaryValue: {
    fontFamily: Typography.display.fontFamily,
    fontSize: 52,
    color: Colors.light.text,
    letterSpacing: -1,
    width: '100%',
    textAlign: 'center',
  },
  primaryUnit: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    letterSpacing: 2,
    color: AccentColors.bissap,
    marginTop: 2,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0ed',
    marginVertical: Spacing.space12,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricBlock: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    lineHeight: 22,
    color: Colors.light.text,
  },
  metricLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.light.ink3,
    marginTop: 4,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f0f0ed',
  },
  elevationBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.space12,
  },
  elevationText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  hudCardCompact: {
    paddingVertical: Spacing.space8,
    paddingHorizontal: Spacing.space12,
    borderRadius: 20,
  },
  primaryValueCompact: {
    fontSize: 42,
  },
  metricValueCompact: {
    fontSize: 15,
  },
});
