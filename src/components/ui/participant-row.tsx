import { Avatar } from '@/components/ui/avatar';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ParticipantStatus = 'Arrivé' | 'À venir';

interface ParticipantRowProps {
  name: string;
  initials: string;
  avatarColor: string;
  paymentStatus: string;
  status: ParticipantStatus;
  onCheckInToggle?: () => void;
}

export function ParticipantRow({
  name,
  initials,
  avatarColor,
  paymentStatus,
  status,
  onCheckInToggle,
}: ParticipantRowProps) {

  const isArrived = status === 'Arrivé';

  return (
    <View style={styles.container}>
      <Avatar initials={initials} size={48} backgroundColor={avatarColor} />

      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.paymentStatus}>{paymentStatus}</Text>
      </View>

      {isArrived ? (
        <View style={styles.statusArrived}>
          <Ionicons name="checkmark-circle" size={16} color="#2f6b4d" style={{ marginRight: 4 }} />
          <Text style={styles.statusArrivedText}>Arrivé</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.statusUpcomingBtn}
          activeOpacity={0.8}
          onPress={onCheckInToggle}
        >
          <Text style={styles.statusUpcomingText}>À venir</Text>
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
  statusArrived: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusArrivedText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: '#2f6b4d',
  },
  statusUpcomingBtn: {
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: Spacing.space16,
    paddingVertical: 8,
    borderRadius: 99,
  },
  statusUpcomingText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
  },
});
