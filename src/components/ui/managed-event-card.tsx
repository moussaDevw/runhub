import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  AccentColors, Spacing, Typography } from '@/constants/theme';

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
  
  // Dynamic styles based on status
  let statusColor: string = Colors.light.ink3; // TERMINÉ
  if (status === 'EN COURS') statusColor = '#2f6b4d';
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
          <Text style={styles.statLabel}>INSCRITS</Text>
          <Text style={styles.statValue}>
            {inscribedCount}<Text style={styles.statTotal}>/{maxCapacity}</Text>
          </Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Right Col: Recette / Type */}
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>{isFree ? 'TYPE' : 'RECETTE'}</Text>
          <Text style={[styles.statValue, !isFree && { color: '#2f6b4d' }]}>
            {isFree ? 'Gratuit' : `${revenue?.toLocaleString('fr-FR')} F`}
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
          >
            <Text style={styles.singleButtonText}>Voir le récap</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.twoButtonsRow}>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              activeOpacity={0.8}
              onPress={onModifierPress}
            >
              <Text style={styles.secondaryButtonText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.primaryButton} 
              activeOpacity={0.8}
              onPress={onCheckInPress}
            >
              <Ionicons name="scan-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.primaryButtonText}>Check-in</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: Spacing.space24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f5f5f4', // very subtle border
    overflow: 'hidden', // so bottom section keeps rounded corners
  },
  topSection: {
    flexDirection: 'row',
    padding: Spacing.space20,
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: Spacing.space16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: Colors.light.ink3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: 8,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
    marginLeft: 4,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f5f5f4',
  },
  statsSection: {
    flexDirection: 'row',
    padding: Spacing.space16,
    paddingHorizontal: Spacing.space20,
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
    marginBottom: 4,
  },
  statValue: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 18,
    color: Colors.light.text,
  },
  statTotal: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: Colors.light.ink3,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#f5f5f4',
    marginHorizontal: Spacing.space16,
  },
  actionsSection: {
    backgroundColor: '#f5f5f4',
    padding: Spacing.space16,
  },
  singleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  twoButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.space12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: Colors.light.text,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: AccentColors.bissap,
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
  },
});
