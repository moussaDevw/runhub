import { Avatar } from '@/components/ui/avatar';
import { AccentColors, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export type ParticipantStatus = 'checked_in' | 'pending' | 'arrived' | 'upcoming';

export interface ParticipantRowProps {
  name: string;
  initials: string;
  avatarColor: string;
  paymentStatus: string;
  isArrived?: boolean;
  status?: ParticipantStatus;
  isLoading?: boolean;
  onCheckInToggle?: () => void;
}

export function ParticipantRow({
  name,
  initials,
  avatarColor,
  paymentStatus,
  isArrived: isArrivedProp,
  status,
  isLoading = false,
  onCheckInToggle,
}: ParticipantRowProps) {
  const { t } = useTranslation();
  const isArrived = isArrivedProp ?? (status === 'checked_in' || status === 'arrived');

  return (
    <View style={styles.container}>
      <Avatar initials={initials} size={48} backgroundColor={avatarColor} />

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.paymentStatus}>{paymentStatus}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={AccentColors.vertTeranga} />
        </View>
      ) : isArrived ? (
        <TouchableOpacity
          style={styles.statusArrivedBtn}
          activeOpacity={0.7}
          onPress={onCheckInToggle}
          accessibilityRole="button"
        >
          <Ionicons name="checkmark-circle" size={16} color={AccentColors.vertTeranga} style={{ marginRight: 4 }} />
          <Text style={styles.statusArrivedText}>{t('event.arrived')}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.statusUpcomingBtn}
          activeOpacity={0.7}
          onPress={onCheckInToggle}
          accessibilityRole="button"
        >
          <Text style={styles.statusUpcomingText}>{t('event.upcoming')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.space12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundElement,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.space12,
    marginRight: Spacing.space12,
    justifyContent: 'center',
  },
  name: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 2,
  },
  paymentStatus: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  loadingContainer: {
    paddingHorizontal: Spacing.space16,
    paddingVertical: 8,
  },
  statusArrivedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf3ed', // vertTeranga light — semantic
    paddingHorizontal: Spacing.space12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cde4d3',
  },
  statusArrivedText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 12,
    color: AccentColors.vertTeranga,
  },
  statusUpcomingBtn: {
    paddingHorizontal: Spacing.space12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: '#e3e3e1',
  },
  statusUpcomingText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
});
