import React, { useMemo } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { MapLibreView } from '@/components/ui/map-libre-view';
import { PolylineService } from '../services/polyline.service';
import { TrackerMetricsService } from '../services/tracker-metrics.service';
import { SPORT_OPTIONS } from './SportSelector';

interface ActivityDetailModalProps {
  activity: any | null;
  visible: boolean;
  onClose: () => void;
}

export function ActivityDetailModal({
  activity,
  visible,
  onClose,
}: ActivityDetailModalProps) {
  const { t, i18n } = useTranslation();

  const formattedDate = useMemo(() => {
    if (!activity?.startedAt) return '';
    const date = new Date(activity.startedAt);
    const locale = i18n.language?.startsWith('en') ? 'en-US' : 'fr-FR';
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [activity?.startedAt, i18n.language]);

  const routeCoordinates = useMemo(() => {
    if (!activity?.polyline) return [];
    try {
      return PolylineService.decode(activity.polyline);
    } catch (e) {
      console.warn('Failed to decode polyline:', e);
      return [];
    }
  }, [activity?.polyline]);

  if (!activity) return null;

  const sportKey =
    typeof activity.sport === 'string'
      ? activity.sport
      : activity.sport?.slug || 'running';
  const sportMeta =
    SPORT_OPTIONS.find((s) => s.key === sportKey) || SPORT_OPTIONS[0];

  const distanceKm = Number(
    activity.distanceKm ||
      (activity.distanceMeters ? activity.distanceMeters / 1000 : 0)
  ).toFixed(2);

  const durationStr = activity.durationSeconds
    ? TrackerMetricsService.formatDuration(activity.durationSeconds)
    : '--:--';

  const paceStr = activity.avgPaceSecPerKm
    ? TrackerMetricsService.formatPace(activity.avgPaceSecPerKm)
    : '--:--';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Top handle pill */}
          <View style={styles.handleContainer}>
            <View style={styles.handlePill} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.sportBadge,
                { backgroundColor: `${sportMeta.color}18` },
              ]}
            >
              <MaterialCommunityIcons
                name={sportMeta.icon as any}
                size={22}
                color={sportMeta.color}
              />
            </View>

            <View style={styles.headerTexts}>
              <Text style={styles.activityTitle} numberOfLines={1}>
                {activity.title || t(`tracker.sports.${sportMeta.key}`)}
              </Text>
              <Text style={styles.activityDate}>{formattedDate}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel={t('tracker.detail.close')}
            >
              <Ionicons name="close" size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Primary Distance Display */}
            <View style={styles.distanceCard}>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.distanceValue}>{distanceKm}</Text>
              <Text style={styles.distanceUnit}>{t('tracker.hud.kilometers')}</Text>
            </View>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>{t('tracker.detail.duration')}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>{durationStr}</Text>
              </View>

              <View style={styles.gridDivider} />

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>{t('tracker.hud.avgPace')}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>{paceStr}</Text>
              </View>

              <View style={styles.gridDivider} />

              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>{t('tracker.hud.calories')}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
                  {activity.caloriesBurned ? `${activity.caloriesBurned} kcal` : '--'}
                </Text>
              </View>

              {activity.elevationGainMeters !== undefined &&
                activity.elevationGainMeters !== null &&
                activity.elevationGainMeters > 0 && (
                  <>
                    <View style={styles.gridDivider} />
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>{t('tracker.detail.elevation')}</Text>
                      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
                        +{Math.round(activity.elevationGainMeters)} m
                      </Text>
                    </View>
                  </>
                )}
            </View>

            {/* Map Preview if polyline is present */}
            {routeCoordinates.length > 1 && (
              <View style={styles.mapContainer}>
                <Text style={styles.sectionSubtitle}>{t('tracker.detail.gpsRoute')}</Text>
                <View style={styles.mapWrapper}>
                  <MapLibreView
                    style={StyleSheet.absoluteFill}
                    routeCoordinates={routeCoordinates}
                    routeColor={sportMeta.color}
                    centerCoords={routeCoordinates[0]}
                    zoomLevel={14}
                    showUserLocation={false}
                  />
                </View>
              </View>
            )}

            {/* Description / Notes if provided */}
            {activity.description ? (
              <View style={styles.notesContainer}>
                <Text style={styles.sectionSubtitle}>{t('tracker.detail.personalNotes')}</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{activity.description}</Text>
                </View>
              </View>
            ) : null}

            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>{t('tracker.detail.close')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    paddingBottom: Spacing.space24,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handlePill: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1ee',
  },
  sportBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space12,
  },
  headerTexts: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  activityDate: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.space20,
    gap: Spacing.space16,
  },
  distanceCard: {
    alignItems: 'center',
    backgroundColor: '#fafaf9',
    borderRadius: 20,
    paddingVertical: Spacing.space20,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  distanceValue: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 48,
    color: AccentColors.bissap,
    lineHeight: 52,
  },
  distanceUnit: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.light.ink3,
    fontWeight: '700',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: Spacing.space12,
    paddingHorizontal: Spacing.space8,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.light.ink3,
    marginBottom: 4,
    fontWeight: '600',
  },
  metricValue: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
  gridDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e5e7eb',
  },
  sectionSubtitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.light.ink3,
    fontWeight: '700',
    marginBottom: 8,
  },
  mapContainer: {
    marginTop: 4,
  },
  mapWrapper: {
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  notesContainer: {
    marginTop: 4,
  },
  notesBox: {
    backgroundColor: '#fafaf9',
    borderRadius: 14,
    padding: Spacing.space12,
    borderWidth: 1,
    borderColor: '#ecece9',
  },
  notesText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: Colors.light.text,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: '#ffffff',
  },
});
