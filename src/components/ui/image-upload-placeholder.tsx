import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface ImageUploadPlaceholderProps {
  onPress?: () => void;
  badgeText?: string;
}

export function ImageUploadPlaceholder({ onPress, badgeText }: ImageUploadPlaceholderProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      style={styles.container}
    >
      {/* We use an image with absolute fill as the gradient background */}
      <Image 
        source={require('@/assets/images/onboarding_bg.png')} 
        style={[StyleSheet.absoluteFill, styles.bgImage]} 
        contentFit="cover"
      />
      
      {/* Dark overlay to make text readable */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="camera-outline" size={24} color={Colors.light.text} />
        </View>
        <Text style={styles.instructionText}>Ajoute une belle photo</Text>
      </View>

      {badgeText && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.space24,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark tint
  },
  centerContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 14,
    color: '#ffffff',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: Spacing.space12,
    left: Spacing.space12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: '#ffffff',
  },
});
