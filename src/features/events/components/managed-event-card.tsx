import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, AccentColors, Spacing, Typography, Radius, Shadows, NeutralColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

export type EventStatus = 'EN COURS' | 'À VENIR' | 'TERMINÉ';

export interface ManagedEventCardProps {
  status: EventStatus;
  dateDay: string;
  dateTime: string;
  title: string;
  location: string;
  imageSource: any;
  inscribedCount: number;
  maxCapacity: number;
  revenue?: number; // In FCFA
  isFree?: boolean;
  onModifierPress?: () => void;
  onCheckInPress?: () => void;
  onRecapPress?: () => void;
}

export function ManagedEventCard({
  status,
  dateDay,
  dateTime,
  title,
  location,
  imageSource,
  inscribedCount,
  maxCapacity,
  revenue,
  isFree,
  onModifierPress,
  onCheckInPress,
  onRecapPress,
}: ManagedEventCardProps) {
  const { t } = useTranslation();
  // Dynamic styles based on status
  let statusColor: string = Colors.light.ink3; // TERMINÉ
  if (status === 'EN COURS') statusColor = AccentColors.vertTeranga;
  if (status === 'À VENIR') statusColor = AccentColors.bissap;

  return (
    <View style={styles.cardContainer}>
      
      {/* TOP SECTION: INFO */}
      <View style={styles.topSection}>
        <Image source={imageSource} style={styles.image} contentFit="cover" />
        
        <View style={styles.infoContainer}>
          <View style={styles.dateStatusRow}>
            <Text style={styles.dateText}>{dateDay} · {dateTime}</Text>
            <View style={[styles.statusBadge, { borderColor: statusColor }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
          </View>
          
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.light.ink3} />
            <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
          </View>
        </View>
      </View>

      {/* DIVIDER */}
      <View style={styles.divider} />

      {/* MIDDLE SECTION: STATS */}
      <View style={styles.statsSection}>
        {/* Left Col: Inscrits */}
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>{t('event.registeredLabel')}</Text>
          <Text style={styles.statValue}>
            {inscribedCount}<Text style={styles.statTotal}>/{maxCapacity}</Text>
          </Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Right Col: Recette / Type */}
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>{isFree ? t('event.typeLabel') : t('event.revenueLabel')}</Text>
          <Text style={[styles.statValue, !isFree && { color: AccentColors.vertTeranga }]}>
            {isFree ? t('event.free') : `${revenue?.toLocaleString('fr-FR')} F`}
          </Text>
        </View>
      </View>

      {/* BOTTOM SECTION: ACTIONS */}
      <View style={styles.actionsSection}>
        {status === 'TERMINÉ' ? (
          <TouchableOpacity 
            style={styles.singleButton} 
            activeOpacity={0.8}
            onPress={onRecapPress}
            accessibilityRole="button"
          >
            <Ionicons name="bar-chart-outline" size={16} color={Colors.light.text} style={{ marginRight: 6 }} />
            <Text style={styles.singleButtonText}>{t('event.seeRecap')}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.actionButtonSecondary} 
              activeOpacity={0.8}
              onPress={onModifierPress}
              accessibilityRole="button"
            >
              <Ionicons name="create-outline" size={16} color={Colors.light.text} style={{ marginRight: 6 }} />
              <Text style={styles.actionButtonSecondaryText}>{t('common.edit')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButtonPrimary} 
              activeOpacity={0.8}
              onPress={onCheckInPress}
              accessibilityRole="button"
            >
              <Ionicons name="scan-outline" size={16} color={NeutralColors.white} style={{ marginRight: 6 }} />
              <Text style={styles.actionButtonPrimaryText}>{t('event.checkIn')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: Radius.card,
    padding: Spacing.space16,
    marginBottom: Spacing.space16,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.card,
  },
  topSection: {
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
  },
  infoContainer: {
    flex: 1,
    marginLeft: Spacing.space12,
    justifyContent: 'center',
  },
  dateStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space4,
  },
  dateText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 11,
    color: Colors.light.ink3,
    letterSpacing: 0.5,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.space8,
    paddingVertical: 2,
  },
  statusText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: Spacing.space4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginLeft: Spacing.space4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.backgroundElement,
    marginVertical: Spacing.space12,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.space16,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  statTotal: {
    fontFamily: Typography.corps.fontFamily,
    color: Colors.light.ink3,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.light.backgroundElement,
    marginHorizontal: Spacing.space16,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: Spacing.space12,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.space12,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.backgroundElement,
  },
  actionButtonSecondaryText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.text,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.space12,
    borderRadius: Radius.sm,
    backgroundColor: AccentColors.bissap,
  },
  actionButtonPrimaryText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: NeutralColors.white,
  },
  singleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.space12,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
  },
  singleButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.text,
  },
});

