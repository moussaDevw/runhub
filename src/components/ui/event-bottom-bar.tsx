import { Colors,  AccentColors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './button';

interface EventBottomBarProps {
  price: string;
  placesStatus: string;
  onParticipate: () => void;
  onChat: () => void;
}

export function EventBottomBar({ price, placesStatus, onParticipate, onChat }: EventBottomBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.places}>{placesStatus}</Text>
      </View>

      <View style={styles.rightContent}>
        <TouchableOpacity activeOpacity={0.8} style={styles.chatButton} onPress={onChat}>
          <Ionicons name="chatbubble-outline" size={22} color={Colors.light.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <View style={styles.participateWrapper}>
          <Button label="Je participe" variant="primary" onPress={onParticipate} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.space20,
    paddingTop: Spacing.space16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24, // Use safe area bottom inset
    backgroundColor: BackgroundThemes.Ivoire,
    borderTopWidth: 1,
    borderTopColor: Colors.light.backgroundElement,

  },
  leftContent: {
    flex: 1,
    paddingLeft: Spacing.space12,
    paddingRight: Spacing.space8,
  },
  price: {
    fontFamily: Typography.titre.fontFamily,
    fontSize: 22,
    color: Colors.light.text,
  },
  places: {
    fontFamily: Typography.meta.fontFamily,
    fontSize: 10,
    color: AccentColors.bissap,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5, // Takes more space for the buttons
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: 16, // squircle shape
    borderWidth: 1,
    borderColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.space16,
    backgroundColor: BackgroundThemes.Ivoire,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AccentColors.bissap,
    borderWidth: 2,
    borderColor: BackgroundThemes.Ivoire,
  },
  participateWrapper: {
    flex: 1.5, // Make button wider
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
