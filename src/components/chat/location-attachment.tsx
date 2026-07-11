import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,  AccentColors, Spacing, Typography, Radius } from '@/constants/theme';

interface LocationAttachmentProps {
  title: string;
  onPress?: () => void;
}

export function LocationAttachment({ title, onPress }: LocationAttachmentProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Ionicons name="location-outline" size={16} color="#ffffff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle}>VOIR SUR LA CARTE</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundElement, // grey background inside the message bubble
    padding: Spacing.space8,
    borderRadius: Radius.card,
    marginTop: Spacing.space8,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: AccentColors.bissap,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 13,
    color: Colors.light.text,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 9,
    color: Colors.light.ink3,
    letterSpacing: 1,
  },
});
