import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, Typography } from '@/constants/theme';

interface ClubWhatsappCardProps {
  onPress: () => void;
}

export function ClubWhatsappCard({ onPress }: ClubWhatsappCardProps) {
  return (
    <TouchableOpacity
      style={styles.whatsappCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.whatsappCardLeft}>
        <View style={styles.whatsappIconCircle}>
          <Ionicons name="logo-whatsapp" size={22} color="#ffffff" />
        </View>
        <View style={styles.whatsappCardTexts}>
          <Text style={styles.whatsappCardTitle}>Groupe WhatsApp officiel</Text>
          <Text style={styles.whatsappCardSubtitle}>
            Échanger avec les membres et suivre les actus
          </Text>
        </View>
      </View>
      <Ionicons name="open-outline" size={20} color="#25D366" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  whatsappCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: Spacing.space24,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  whatsappCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  whatsappIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  whatsappCardTexts: {
    flex: 1,
  },
  whatsappCardTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 2,
  },
  whatsappCardSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
});

