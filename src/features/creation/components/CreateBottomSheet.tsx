import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccentColors, BackgroundThemes, Colors, Spacing, Typography } from '@/constants/theme';
import { useCreateModal } from '@/features/creation/store/useCreateModal';

const ACTION_ITEMS = [
  {
    id: 'event',
    icon: 'calendar-outline' as const,
    title: 'Organiser un événement',
    subtitle: 'Une sortie unique avec la communauté',
    href: '/event/create',
    color: AccentColors.bissap,
    bgColor: '#fdf0f3',
  },
  {
    id: 'club',
    icon: 'people-outline' as const,
    title: 'Créer un club',
    subtitle: 'Fonder un groupe régulier',
    href: '/club/create',
    color: AccentColors.indigoWolof,
    bgColor: '#f0f1f8',
  },
];

export function CreateBottomSheet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isVisible, close } = useCreateModal();

  // Keep modal mounted until exit animation completes
  const [modalMounted, setModalMounted] = useState(false);
  const translateY = useSharedValue(600);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      setModalMounted(true);
      // Animate in
      overlayOpacity.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, { damping: 22, stiffness: 200 });
    } else if (modalMounted) {
      // Animate out then unmount
      overlayOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(600, { duration: 280 }, (finished) => {
        if (finished) runOnJS(setModalMounted)(false);
      });
    }
  }, [isVisible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleClose = () => {
    close();
  };

  const handlePress = (href: string) => {
    close();
    setTimeout(() => router.push(href as any), 300);
  };

  if (!modalMounted) return null;

  return (
    <Modal
      visible={modalMounted}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlayBase} onPress={handleClose}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlayColor, overlayStyle]} />
        <Animated.View
          style={[styles.sheet, sheetStyle, { paddingBottom: Math.max(insets.bottom, 24) }]}
        >
          <Pressable>
            {/* Handle bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Que voulez-vous créer ?</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={18} color={Colors.light.ink3} />
              </TouchableOpacity>
            </View>

            {/* Action Cards */}
            <View style={styles.actionsContainer}>
              {ACTION_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.actionCard}
                  activeOpacity={0.75}
                  onPress={() => handlePress(item.href)}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>{item.title}</Text>
                    <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.light.ink3} />
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayBase: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayColor: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: BackgroundThemes.Ivoire,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.space20,
    paddingTop: 12,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d6d3ce',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.space24,
  },
  headerTitle: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 20,
    color: Colors.light.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0ede9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    gap: Spacing.space12,
    marginBottom: Spacing.space8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: Spacing.space16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontFamily: Typography.corps.fontFamily,
    fontSize: 13,
    color: Colors.light.ink3,
  },
});
