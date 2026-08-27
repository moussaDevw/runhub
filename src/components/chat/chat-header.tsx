import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors,  AccentColors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  imageSource: any;
  onEventPress: () => void;
}

export function ChatHeader({ title, subtitle, imageSource, onEventPress }: ChatHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.space12) }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
      </TouchableOpacity>

      <View style={styles.eventInfo}>
        <Image source={imageSource} style={styles.eventImage} contentFit="cover" />
        <View style={styles.textColumn}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.eventButton} onPress={onEventPress}>
        <Text style={styles.eventButtonText}>EVENT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    paddingBottom: Spacing.space12,
    backgroundColor: BackgroundThemes.Ivoire,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundElement,
  },
  backButton: {
    marginRight: Spacing.space12,
  },
  eventInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: Spacing.space12,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 12,
    color: Colors.light.ink3,
  },
  eventButton: {
    paddingHorizontal: Spacing.space12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AccentColors.bissap,
    marginLeft: Spacing.space12,
  },
  eventButtonText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 10,
    color: AccentColors.bissap,
    textTransform: 'uppercase',
  },
});
