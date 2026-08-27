import { Colors,  AccentColors, BackgroundThemes, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from './button';
import { useTranslation } from 'react-i18next';

interface EventBottomBarProps {
  price: string;
  placesStatus: string;
  onParticipate: () => void;
  onChat: () => void;
  isRegistered?: boolean;
  isLoading?: boolean;
  isOrganizer?: boolean;
  onManage?: () => void;
}

export function EventBottomBar({ 
  price, 
  placesStatus, 
  onParticipate, 
  onChat, 
  isRegistered = false, 
  isLoading = false,
  isOrganizer = false,
  onManage
}: EventBottomBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.price}>{price}</Text>
        <Text style={[
          styles.places,
          isRegistered && styles.placesRegistered,
          isOrganizer && styles.placesOrganizer,
        ]}>{placesStatus}</Text>
      </View>

      <View style={styles.rightContent}>
        <TouchableOpacity activeOpacity={0.8} style={styles.chatButton} onPress={onChat}>
          <Ionicons name="chatbubble-outline" size={22} color={Colors.light.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <View style={styles.participateWrapper}>
          {isLoading ? (
            <View style={[styles.participateBtn, styles.loadingBtn]}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          ) : isOrganizer ? (
            <TouchableOpacity
              style={[styles.participateBtn, styles.organizerBtn]}
              activeOpacity={0.8}
              onPress={onManage || onParticipate}
            >
              <Ionicons name="settings-outline" size={18} color={Colors.light.text} style={{ marginRight: 6 }} />
              <Text style={styles.organizerBtnText}>{t('event.manage')}</Text>
            </TouchableOpacity>
          ) : isRegistered ? (
            <TouchableOpacity
              style={[styles.participateBtn, styles.cancelBtn]}
              activeOpacity={0.8}
              onPress={onParticipate}
            >
              <Ionicons name="checkmark-circle" size={18} color={AccentColors.vertTeranga} style={{ marginRight: 6 }} />
              <Text style={styles.cancelBtnText}>Inscrit</Text>
            </TouchableOpacity>
          ) : (
            <Button label="Je participe" variant="primary" onPress={onParticipate} />
          )}
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
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
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
  placesRegistered: {
    color: AccentColors.vertTeranga,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
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
    flex: 1.5,
    shadowColor: AccentColors.bissap,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  participateBtn: {
    height: 48,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: AccentColors.vertTeranga,
  },
  cancelBtnText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: AccentColors.vertTeranga,
  },
  loadingBtn: {
    backgroundColor: AccentColors.bissap,
  },
  placesOrganizer: {
    color: Colors.light.textSecondary,
  },
  organizerBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: Colors.light.text,
  },
  organizerBtnText: {
    fontFamily: Typography.corpsGras.fontFamily,
    fontSize: 15,
    color: Colors.light.text,
  },
});
