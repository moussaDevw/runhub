import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageUploadPlaceholderProps {
  title?: string;
  onPress?: () => void;
  badgeText?: string;
  imageUrl?: string | null;
  isUploading?: boolean;
  onRemove?: () => void;
}

export function ImageUploadPlaceholder({
  title,
  onPress,
  badgeText,
  imageUrl,
  isUploading,
  onRemove,
}: ImageUploadPlaceholderProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      {imageUrl ? (
        // L'image uploadée est affichée en prévisualisation
        <Image
          source={{ uri: imageUrl }}
          style={[StyleSheet.absoluteFill, styles.bgImage]}
          contentFit="cover"
        />
      ) : (
        // Image de fond par défaut quand aucune cover n'est choisie
        <Image
          source={require('@/assets/images/onboarding_bg.png')}
          style={[StyleSheet.absoluteFill, styles.bgImage]}
          contentFit="cover"
        />
      )}

      {/* Dark overlay pour lisibilité */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      {isUploading ? (
        // Spinner pendant l'upload
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.uploadingText}>Upload en cours...</Text>
        </View>
      ) : imageUrl ? (
        // Bouton "Changer la photo" si une image est déjà uploadée
        <View style={styles.centerContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera-outline" size={24} color={Colors.light.text} />
          </View>
          <Text style={styles.instructionText}>Changer la photo</Text>
          {onRemove && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={(e) => {
                e.stopPropagation?.();
                onRemove();
              }}
            >
              <Ionicons name="close-circle" size={22} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        // État initial : inviter à ajouter une photo
        <View style={styles.centerContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera-outline" size={24} color={Colors.light.text} />
          </View>
          <Text style={styles.instructionText}>{title || 'Ajoute une belle photo'}</Text>
        </View>
      )}

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
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  centerContent: {
    alignItems: 'center',
    zIndex: 2,
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
  uploadingText: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 14,
    color: '#ffffff',
    marginTop: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -60,
    right: -60,
    padding: 6,
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
